import time
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import json
from dataclasses import dataclass

#creating the flask app
app = Flask("__name__")

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

# ------------------------------------------------------------
# Database Structure and Definition
# ------------------------------------------------------------
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mischlining.sqlite"
db = SQLAlchemy(app) # <- database object

@dataclass
class Entry(db.Model):
    name: str
    id: int
    marks: int

    name = db.Column(db.String, unique = False, nullable = True)
    id = db.Column(db.Integer, primary_key = True)
    marks = db.Column(db.Integer, unique = False, nullable = True)

# ------------------------------------------------------------
# CRUD Operations
# ------------------------------------------------------------

# simply initialize the database
@app.route('/createDB')
def createDB():
    # initialize table
    db.drop_all()
    db.create_all()

    # get initial data
    with open("testData.txt") as fp:
        data = fp.read().split()
        fp.close()
    
    # parse initial data and add it to database
    i = 0
    while i < len(data):
        db.session.add(Entry(name = data[i], id = int(data[i+1]), marks = int(data[i+2])))
        i += 3
    db.session.commit()
    
    # return JSON version of table
    rows = Entry.query.all()
    return jsonify(data=rows)

#given a name, id, and marks, create a new Entry object and add it to db
@app.route('/updateDB', methods = ['POST'])
def updateDB():
    entry = request.json
    marks = int(entry["marks"])
    ids = [entries.id for entries in Entry.query.all()]
    if type(entry["name"]) is str and marks in range(0,100) and int(entry["id"]) not in ids:
        newEntry = Entry(name = entry["name"], id = int(entry["id"]), marks = int(entry["marks"]))
        db.session.add(newEntry)
        db.session.commit()
        return jsonify(data=True)
    return jsonify(data=False)

#delete database entry
@app.route('/deleteDB', methods = ['POST'])
def deleteDB():
    id = request.json
    if id:
        to_delete = Entry.query.get(id)
        db.session.delete(to_delete)
        db.session.commit()
        return jsonify(data=id)
    return "ERROR: No ID Specified in Request"
    
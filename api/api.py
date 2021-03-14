import time
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import json

#creating the flask app
app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

# ------------------------------------------------------------
# Database Structure and Definition
# ------------------------------------------------------------
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mischlining.sqlite"
db = SQLAlchemy(app) # <- database object

class Entry(db.Model):
    name = db.Column(db.String, unique = False, nullable = True)
    id = db.Column(db.Integer, primary_key = True)
    marks = db.Column(db.Integer, unique = False, nullable = True)

# ------------------------------------------------------------
# CRUD Operations
# ------------------------------------------------------------

# simply initialize the database
@app.route('/createDB')
def createDB():
    db.create_all()
    rows = Entry.query.all()
    return json.dumps(rows)

# returns a json of all rows in the database
@app.route('/readDB')
def readDB():
    rows = Entry.query.all()
    return json.dumps(rows)

#given a name, id, and marks, create a new Entry object and add it to db
@app.route('/updateDB')
def updateDB(_name, _id, _marks):
    newEntry = Entry(name = _name, id = _id, marks = _marks)
    db.session.add(newEntry)
    db.session.commit()

#delete database then reinitialize it, effectively cleansing all Entrys
@app.route('/deleteDB')
def deleteDB():
    db.drop_all()
    db.create_all()
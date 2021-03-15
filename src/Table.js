import React, { Component } from 'react';
import {  Table } from "semantic-ui-react";
import './style.css';

class MyTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            id: '0',
            marks: '0',
            data: this.props.db
        };
    
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleIdChange = this.handleIdChange.bind(this);
        this.handleMarksChange = this.handleMarksChange.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.addEntry = this.addEntry.bind(this);
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }
    handleIdChange(event) {
        this.setState({id: event.target.value});
    }
    handleMarksChange(event) {
        this.setState({marks: event.target.value});
    }

    deleteEntry = (id, event) => {
        fetch("/deleteDB", {
            method: "POST",
            cache: "no-cache",
            headers:{
                "content_type":"application/json",
                },
            body: JSON.stringify(id)
            }
        ).then(response => {
            return response.json();
            }
        ).then(json => {
            // delete id from data
            var index_to_del = this.state.data.findIndex((entry) => entry.id === json.data);
            var _data = [...this.state.data];
            _data.splice(index_to_del, 1);
            this.setState({data: _data}) //update state
        })
    }

    addEntry = (__name, __id, __marks, event) => {
        event.preventDefault();
        if (__name && __id && __marks && typeof(__name) == "string" && typeof(__id) == "string" && typeof(__marks) == "string") {

            var newEntry = {
                name: __name,
                id: __id,
                marks: __marks
            };

            fetch("/updateDB", {
                method: "POST",
                cache: "no-cache",
                headers:{
                    "content_type":"application/json",
                    'Accept': 'application/json'
                    },
                body: JSON.stringify(newEntry)
                }
            ).then(response => {
                return response.json();
                }
            ).then(json => {
                if (json.data === true) {
                    // add entry to data
                    var _data = [...this.state.data];
                    _data.push(newEntry);
                    //add the row
                    this.setState({data: _data}) //update state
                }
            })
        } else {
            console.log("Invalid Parameters");
        }
    }

    render() {
        return (
            <div>
            <Table singleLine striped className="table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Id</Table.HeaderCell>
                  <Table.HeaderCell>Marks</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
      
              <Table.Body>
                {this.state.data.map(el => {
                  return (
                    <Table.Row key={el.id} id={el.id} className="slate-with-padding">
                      <Table.Cell>{el.name}</Table.Cell>
                      <Table.Cell>{el.id}</Table.Cell>
                      <Table.Cell>{el.marks}</Table.Cell>
                      <Table.Cell><button onClick={(e) => this.deleteEntry(el.id, e)}>Delete Entry</button></Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
            <form onSubmit={(e) => this.addEntry(this.state.name, this.state.id, this.state.marks, e)}>
                <label>
                    Name:
                    <input type="text" value={this.state.name} onChange={this.handleNameChange} />
                </label>
                <label>
                    Id:
                    <input type="text" value={this.state.id} onChange={this.handleIdChange} />
                </label>
                <label>
                    Marks:
                    <input type="text" value={this.state.marks} onChange={this.handleMarksChange} />
                </label>
                <input type="submit" value="Add Entry" />
            </form>
            </div>
          );
    }

}

export default MyTable;
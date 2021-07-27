import React, { Component } from "react";
import "./App.css";
import ItemInput from "./Components/ItemInput";
import CurrentList from "./Components/CurrentList";
import firebase from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      hasName: false,
      finalInput: [],
      items: new Map()
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange = event => {
    event.preventDefault();
    this.setState({ name:event.target.value });
  }

  handleNameSubmit = event => {
    this.setState({ hasName: true })

    //firebase
    const itemsRef = firebase.database().ref('session/session1/users');
    itemsRef.once("value", snapshot => {
      if (!snapshot.exists()) {
        //no user present in session yet -> create "users" field and add current user
        
      } else {
        //if snapshot exists, get list of users to check for duplicates
        
      }
    }) 
    
  }

  resetName = () => {
    this.setState({
      name: "",
      hasName: false
    })
  }

  receiveItemInput = currentInput => {
    this.setState({finalInput: this.state.finalInput.concat([currentInput])});

    if (this.state.items.size === 0) {
      this.state.items.set(currentInput, [this.state.name]);
    } else {
      if (this.state.items.has(currentInput)) {
        this.state.items.set(
          currentInput,
          this.state.items.get(currentInput).concat([this.state.name])
        );
      } else {
        this.state.items.set(currentInput, [this.state.name]);
      }
    }
  }

  render() {
    if (!this.state.hasName) {
      return(
        <div className="homepage">
          <p>Hello!</p>
          <label>Enter your name: </label>
          <form>
            <input type="text" name="usernameValue" id="usernameInput"
              onChange={this.handleNameChange}
              onKeyPress={event => {
                  if (event.key === 'Enter') {
                    this.handleNameSubmit(event)
                  }
                }}/>
            <button onClick={this.handleNameSubmit}>Submit</button>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <ItemInput
            name = {this.state.name}
            receiveItemInput = {this.receiveItemInput}
            goBack = {this.resetName}
          />
          <CurrentList
            items = {this.state.items}
          />
        </div>
      );
    }
  }
}

export default App;

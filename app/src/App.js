import React, { Component } from "react";
import "./App.css";
import ItemInput from "./Components/ItemInput";
import CurrentList from "./Components/CurrentList";
import firebase from './firebase';

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
    var username = this.state.name;

    var docRef = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln");

    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        if (doc.data().users.includes(this.state.name)) {
          // Potentially special treatment for returning users (frontend things)
        }

        // This method only adds elements not already present
        docRef.update({
          users: firebase.firestore.FieldValue.arrayUnion(this.state.name)
        });

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });

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

    // firebase
    var docRef = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln")
                                     .collection("items").doc(currentInput);
    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());

        docRef.update({
          votes: firebase.firestore.FieldValue.arrayUnion(this.state.name)
        });

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");

        // Create the document?
        firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln")
                            .collection("items").doc(currentInput).set({
                              votes: [ this.state.name ]
                            })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
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

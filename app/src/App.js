import React, { Component } from "react";
import "./App.css";
import ItemInput from "./Components/ItemInput";
import CurrentList from "./Components/CurrentList";
import firebase from './firebase';
import UserList from "./Components/UserList";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      hasName: false,
      finalInput: []
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange = event => {
    event.preventDefault();
    this.setState({ name:event.target.value });
  }

  handleNameSubmit = event => {
    this.setState({ hasName: true })

    var docRef = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln");

    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        if (doc.data().users.includes(this.state.name)) {
          // Potentially special treatment for returning users (frontend things)
        }

        // This method only adds elements not already present
        return docRef.update({
          users: firebase.firestore.FieldValue.arrayUnion(this.state.name)
        });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
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

    // firebase
    var docRef = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln")
                                     .collection("items").doc(currentInput);
    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());

        if (!doc.data().votes.includes(this.state.name)) {
          docRef.update({
            votes: firebase.firestore.FieldValue.arrayUnion(this.state.name),
            count: firebase.firestore.FieldValue.increment(1)
          });
        }

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");

        // Create the document?
        firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln")
                            .collection("items").doc(currentInput).set({
                              votes: [ this.state.name ],
                              count: 1
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

          <UserList
            username = {this.state.name}
          />

          <CurrentList
            username = {this.state.name}
            receiveItemInput = {this.receiveItemInput}
          />
        </div>
      );
    }
  }
}

export default App;

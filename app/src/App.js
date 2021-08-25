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
      username: "",
      hasName: false,
      existingUsers: []
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentDidMount () {
    firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln")
    .onSnapshot((doc) => {
      var localExistingUsers = [];

      localExistingUsers.push(
        <option selected value="">Select user</option>
      )
      doc.data().users.forEach((user) => {
        localExistingUsers.push(
          <option value={user}>
            {user}
          </option>
        );
      })

      this.setState({
        existingUsers: localExistingUsers
      })
    });
  }


  handleNameChange = event => {
    event.preventDefault();
    this.setState({ username:event.target.value });
  }

  handleNameSubmit = event => {
    if (this.state.username === "") {
      window.alert("Display name cannot be empty!");
      event.preventDefault();
    } else {
      this.setState({ hasName: true })

      var docRef = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln");

      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          if (doc.data().users.includes(this.state.username)) {
            // Potentially special treatment for returning users (frontend things)
          }

          // This method only adds elements not already present
          return docRef.update({
            users: firebase.firestore.FieldValue.arrayUnion(this.state.username)
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });
    }
  }

  resetName = () => {
    this.setState({
      username: "",
      hasName: false
    })
  }

  receiveItemInput = currentInput => {
    var docRef = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln")
                                     .collection("items").doc(currentInput);
    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());

        if (!doc.data().votes.includes(this.state.username)) {
          docRef.update({
            count: firebase.firestore.FieldValue.increment(1),
            votes: firebase.firestore.FieldValue.arrayUnion(this.state.username)

          });
        }

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");

        // Create the document
        firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln")
                            .collection("items").doc(currentInput).set({
                              votes: [ this.state.username ],
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
        <div className="general">
          <p>Hello!</p>

          <form>
          <label>Log in as: </label>
            <select value={this.state.username} onChange={this.handleNameChange}>
              {this.state.existingUsers}
            </select>
            <button onClick={this.handleNameSubmit}>Go!</button>
          </form>
          <p>OR</p>
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
          <br/>
          <UserList
            username = {this.state.username}
          />
        </div>
      );
    } else {
      return (
        <div className="general">
          <ItemInput
            username = {this.state.username}
            receiveItemInput = {this.receiveItemInput}
            goBack = {this.resetName}
          />


          <CurrentList
            username = {this.state.username}
            receiveItemInput = {this.receiveItemInput}
          />
        </div>
      );
    }
  }
}

export default App;

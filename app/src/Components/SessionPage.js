import React, { Component } from "react";
import firebase from '../firebase';
import ItemInput from "./ItemInput";
import CurrentList from "./CurrentList";
import UserList from "./UserList";

class SessionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      hasName: false,
      existingUsers: []
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  // "n4JhCl5XDul2rGHAlJln"
  componentDidMount () {
    firebase.firestore().collection("sessions").doc(this.props.sessionID)
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

      var docRef = firebase.firestore().collection("sessions").doc(this.props.sessionID);

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
    var docRef = firebase.firestore().collection("sessions").doc(this.props.sessionID)
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
        firebase.firestore().collection("sessions").doc(this.props.sessionID)
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
            sessionID = {this.props.sessionID}
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
            sessionID = {this.props.sessionID}
          />
        </div>
      );
    }
  }
}

export default SessionPage;

import React, { Component } from "react";
import "./App.css";
import firebase from './firebase';
import SessionPage from "./Components/SessionPage";

class App extends Component {
  constructor() {
    super();
    this.state = {
      sessionID: null
    };
    this.createSession = this.createSession.bind(this);
    this.resetSession = this.resetSession.bind(this);
  }

  componentDidMount () {
    const queryParams = new URLSearchParams(window.location.search);
    const session = queryParams.get('session');

    if (session !== "" && session !== null) {
      firebase.firestore().collection("sessions").doc(session).get().then((doc) => {
        if (doc.exists) {
          this.setState({
            sessionID: session
          })
        } else {
          this.setState({
            sessionID: ""
          })
        }
      })
    }
  }

  createSession() {
    var db = firebase.firestore().collection("sessions");
    db.add({
      users: []
    })
    .then((doc) => {
      console.log("Document successfully written!");
      console.log(doc.id);
      this.setState({
        sessionID: doc.id
      });
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  }

  resetSession() {
    this.setState({
      sessionID: null
    })
    window.location.href =  window.location.href.split("?")[0];
  }

  render() {
    if (this.state.sessionID === null) {
      return (
        <React.Fragment>
          <button onClick={ this.createSession }>Create a new session!</button>
        </React.Fragment>
      );
    } else if (this.state.sessionID === "") {
      this.resetSession();
      window.alert("This is an invalid session ID.");
    } else {
      return (
        <React.Fragment>
          <SessionPage
            sessionID = { this.state.sessionID }
            resetSession = { this.resetSession }
          />
        </React.Fragment>
      );
    }
  }
}

export default App;

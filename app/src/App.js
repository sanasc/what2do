import React, { Component } from "react";
import "./App.css";
import firebase from './firebase';
import SessionPage from "./Components/SessionPage";

class App extends Component {
  constructor() {
    super();
    this.state = {
      sessionID: null,
      externalID: null,
      tempExternalID: null
    };
    this.createSession = this.createSession.bind(this);
    this.resetSession = this.resetSession.bind(this);
    this.renameSession = this.renameSession.bind(this);
    this.handleExternalIDChange = this.handleExternalIDChange.bind(this);
  }

  componentDidMount () {
    const queryParams = new URLSearchParams(window.location.search);
    const URLName = queryParams.get('session');
    if (URLName !== "" && URLName !== null) {
      firebase.firestore().collection("sessions").where("externalID", "==", URLName).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            this.setState({
              sessionID: doc.id,
              externalID: URLName
            })
          } else {
            this.setState({
              sessionID: "",
              externalID: ""
            })
          }
        });        
      })
    }
  }

  handleExternalIDChange = event => {
    event.preventDefault();
    console.log("User selected an externalID: " + event.target.value);
    this.setState({ tempExternalID: event.target.value });
    console.log("state tempExternalID: " + this.state.tempExternalID);
  }

  createSession() {
    console.log("this.state.tempExternalID: " + this.state.tempExternalID);
    var db = firebase.firestore().collection("sessions");
    firebase.firestore().collection("sessions").where("externalID", "==", this.state.tempExternalID).get().then((querySnapshot) => {
      if (!querySnapshot.empty){
        this.setState({sessionID: ""})
      } else {
        db.add({
          users: [],
          externalID: ""
        })
        .then((doc) => {
          console.log("Document successfully written! Doc.id: " + doc.id);
          if (this.state.tempExternalID === null) {
            this.setState({
              sessionID: doc.id,
              externalID: doc.id
            });
            db.doc(doc.id).update({
              externalID: doc.id
            })
          } else {
              this.setState({
                  sessionID: doc.id,
                  externalID: this.state.tempExternalID
                });
                db.doc(doc.id).update({
                  externalID: this.state.tempExternalID
                })
              }
            })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
      }
    });
  }

  resetSession() {
    this.setState({
      sessionID: null,
      externalID: null
    })
    window.location.href =  window.location.href.split("?")[0];
  }

  renameSession = newExternalID => {
    firebase.firestore().collection("sessions").doc(this.state.sessionID).update({
      externalID: newExternalID
    })

    this.setState({
      externalID: newExternalID
    })
  }

  render() {
    console.log("sessionID: " + this.state.sessionID);
    if (this.state.sessionID === null) {
      return (
        <React.Fragment>
          <label>Pick your own custom URL! </label>
          <br/>
          <input type="text" id="externalIDInput"
            onChange={this.handleExternalIDChange}
            onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.createSession(event)
                }
            }}/>
          <button onClick={ this.createSession }>Submit your own URL</button>
          <button onClick={ this.createSession }>Use a randomly generated URL</button>
        </React.Fragment>
      );
    } else if (this.state.sessionID === "") {
      console.log("Made it to the else-if!");
      this.resetSession();
      window.alert("This is an invalid session ID.");
    } else {
      return (
        <React.Fragment>
          <SessionPage
            sessionID = { this.state.sessionID }
            resetSession = { this.resetSession }
            renameSession = { this.renameSession }
            externalID = { this.state.externalID }
          />
        </React.Fragment>
      );
    }
  }
}

export default App;

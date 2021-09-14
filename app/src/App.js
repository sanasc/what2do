import React, { Component } from "react";
import "./App.css";
import firebase from './firebase';
import SessionPage from "./Components/SessionPage";

import {
  createTheme,
  createStyles,
  withStyles,
  makeStyles,
  Theme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#7CB7AF"),
    backgroundColor: "#7CB7AF",
    margin: "0 1em",
    '&:hover': {
      backgroundColor: "#16796F",
    },
    '&:disabled': {
      backgroundColor: "#9CA89E",
    },
  },
}))(Button);

const TextFieldExtId = withStyles((theme) => ({
  root: {
    width: "25%",
    minWidth: "15em",
    '& label.Mui-focused': {
      color: "#16796F",
    },
    '& input:valid + fieldset': {
      borderColor: "#7CB7AF",
      borderWidth: 2,
    },
    '& input:invalid + fieldset': {
      borderColor: "#16796F",
      borderWidth: 2,
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 6,
      borderColor: "#16796F",
      textColor: "#16796F",
      padding: '4px !important',
    },
  },
}))(TextField);

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
    this.SplashBanner = this.SplashBanner.bind(this);
  }

  componentDidMount () {
    const queryParams = new URLSearchParams(window.location.search);
    const URLName = queryParams.get('session');
    if (URLName !== "" && URLName !== null) {
      firebase.firestore().collection("sessions").where("externalID", "==", URLName).get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            this.setState({
              sessionID: doc.id,
              externalID: URLName
            });
          });
        } else {
          this.setState({
            sessionID: "",
            externalID: ""
          });
        }
      })
    }
  }

  handleExternalIDChange = event => {
    event.preventDefault();
    this.setState({ tempExternalID: event.target.value });
  }

  createSession() {
    console.log("this.state.tempExternalID: " + this.state.tempExternalID);
    var db = firebase.firestore().collection("sessions");
    firebase.firestore().collection("sessions").where("externalID", "==", this.state.tempExternalID).get().then((querySnapshot) => {
      if (!querySnapshot.empty){
        this.setState({sessionID: null})
        window.alert("This session ID already exists.\nPlease input a different session ID.")
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
    window.location.href = window.location.href.split("?")[0];
  }

  renameSession = newExternalID => {
    firebase.firestore().collection("sessions").doc(this.state.sessionID).update({
      externalID: newExternalID
    })

    this.setState({
      externalID: newExternalID
    })
  }

  SplashBanner(props) {
    return (
      <div className="banner splash">
        <h1>{props.text}</h1>
      </div>
    );
  }

  render() {
    if (this.state.sessionID === null) {
      return (
        <React.Fragment>

        <this.SplashBanner text="Welcome to what2do"/>
        <div className="splash">

          <h2>Create a new session below!</h2>
          <br/>

          <TextFieldExtId id="externalIDInput" label="Pick your own custom URL!" variant="outlined"
            onChange={this.handleExternalIDChange}
            onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.createSession(event)
                }
            }}/>
          <ColorButton
            className ="color-button"
            variant="contained"
            color="primary"
            size="large"
            disableElevation
            disabled={this.state.tempExternalID == null || this.state.tempExternalID == ""}
            onClick={ this.createSession }>Submit</ColorButton>
          <p><i>OR</i></p>
          <ColorButton className ="color-button"
            variant="contained"
            color="primary"
            disableElevation
            size="large"
            className="btn btn-outline-dark btn-lg btn-block"
            onClick={ this.createSession }>Use a randomly generated URL</ColorButton>
          <br/>
        </div>
        </React.Fragment>
      );
    } else if (this.state.sessionID === "") {
      console.log("Made it to the else-if!");
      window.alert("This is an invalid session ID.");
      this.resetSession();
    } else {
      return (
        <React.Fragment>
          <SessionPage
            sessionID = { this.state.sessionID }
            resetSession = { this.resetSession }
            renameSession = { this.renameSession }
            externalID = { this.state.externalID }
            SplashBanner = { this.SplashBanner }
          />
        </React.Fragment>
      );
    }
  }
}

export default App;

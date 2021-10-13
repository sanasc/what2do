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
    this.CreditsBanner = this.CreditsBanner.bind(this);
    this.Blurb = this.Blurb.bind(this);
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

    // check for expired sessions to delete
    firebase.firestore().collection("sessions").get()
    .then((querySnapshot) => {
      var today = new Date();
      querySnapshot.forEach((doc) => {
        if (doc.data().expirationDate.toDate() < today) {
          firebase.firestore().collection("sessions").doc(doc.id).collection("items").get().then((subQuerySnapshot) => {
            subQuerySnapshot.forEach((subDoc) => {
              subDoc.ref.delete().then(() => {
                console.log("documents in subcollection of expired document has been deleted")
              })
            })
          })
          doc.ref.delete().then(() => {
            console.log("expired documment has been deleted");
          });
        }
      });
    });
  }

  handleExternalIDChange = event => {
    event.preventDefault();
    this.setState({ tempExternalID: event.target.value });
  }

  createSession() {
    console.log("this.state.tempExternalID: " + this.state.tempExternalID);
    var db = firebase.firestore().collection("sessions");

    if (this.state.tempExternalID != null && this.state.tempExternalID.includes("/")) {
      this.setState({sessionID: null})
      window.alert("This is an invalid session ID. Please avoid using forward slashes (/).")
      return;
    }

    firebase.firestore().collection("sessions").where("externalID", "==", this.state.tempExternalID).get().then((querySnapshot) => {
      if (!querySnapshot.empty){
        this.setState({sessionID: null})
        window.alert("This session ID already exists.\nPlease input a different session ID.")
      } else {
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + 30);

        db.add({
          users: [],
          externalID: "",
          expirationDate: firebase.firestore.Timestamp.fromDate(expDate)
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

    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('session', newExternalID); //this.state.tempExternalID
    window.history.replaceState({}, '', `${window.location.pathname}?${queryParams}`);

    window.alert("Successfully changed session ID.")
  }

  SplashBanner(props) {
    return (
      <div className="banner splash">
        <h1>{props.text}</h1>
      </div>
    );
  }

  Blurb(props) {
    var introText = "What2Do is a multipurpose polling tool designed to facilitate group decisions. Users can brainstorm ideas together, vote on their favorites, and then select the most popular option(s).";
    var walkthroughText = "Here's how to get started:";
    // "To begin, select a personalized URL or let What2Do automatically generate one - this will be used to share & access your What2Do in the future! The next page shows ";
    return (
      <div className="summary">
        {introText}
        <br/>
        <br/>

        <ol className="instructionList">
          <strong>{walkthroughText}</strong>
          <li> Select a personalized URL or let What2Do generate one - this will be used to share & access your What2Do in the future!</li>
          <li> Create a username that will represent your votes</li>
          <li> Vote for existing items or add your own to the poll!</li>
        </ol>
      </div>
    );
  }

  CreditsBanner(props) {
    var devs = [
      {
        name: "Sana Suse",
        github: "https://github.com/sanasc/",
        linkedin: "https://www.linkedin.com/in/sanasuse/",
        email: "15sanasc@gmail.com"
      },
      {
        name: "Irene Wachirawutthichai",
        github: "https://github.com/lalinw/",
        linkedin: "https://www.linkedin.com/in/lalinw/",
        email: "i.lalinw@gmail.com"
      },
      {
        name: "David Kang",
        github: "https://github.com/DaviidK",
        linkedin: "https://www.linkedin.com/in/david-j-kang",
        email: "kang.david.j@gmail.com",
      }
    ]

    return (
      <div className="banner credits">
        <h3>Brought to you by:</h3>
        {devs.map((person) => {
            return (
              <div key={person.name} className="person">
                {person.name}
                <br/>
                <a href={person.github} target="_blank" rel="noopener noreferrer">
                  Github
                </a> | <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a> | <a href={"mailto:" + person.email} target="_blank" rel="noopener noreferrer">
                  {person.email}
                </a>
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    if (this.state.sessionID === null) {
      return (
        <React.Fragment>

        <this.SplashBanner text="Welcome to What2Do"/>
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
        <this.Blurb/>
        <this.CreditsBanner/>
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

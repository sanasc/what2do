import React, { Component } from "react";
import firebase from '../firebase';
import ItemInput from "./ItemInput";
import CurrentList from "./CurrentList";
import UserList from "./UserList";

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
    // textTransform: "none",
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

const CustomTextField = withStyles((theme) => ({
  root: {
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

class SessionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      hasName: false,
      existingUsers: [],
      tempExternalID: ""
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSessionChange = this.handleSessionChange.bind(this);
    this.handleSessionSubmit = this.handleSessionSubmit.bind(this);
  }

  componentDidMount () {
    // Update URL to include "?session=" and the external ID
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('session', this.props.externalID);
    window.history.replaceState({}, '', `${window.location.pathname}?${queryParams}`);

    // Collect the user names of everyone in this session
    firebase.firestore().collection("sessions").doc(this.props.sessionID)
    .onSnapshot((doc) => {
      var localExistingUsers = [];

      localExistingUsers.push(
        <option key={"default"} value="DEFAULT">Select user</option>
      )
      doc.data().users.forEach((user) => {
        localExistingUsers.push(
          <option key={user} value={user}>
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

  handleSessionChange = event => {
    event.preventDefault();
    console.log(event.target.value);
    this.setState({ tempExternalID:event.target.value });
  }

  handleSessionSubmit(event) {
    event.preventDefault();
    console.log(this.state.tempExternalID);

    firebase.firestore().collection("sessions").doc(this.state.tempExternalID)
      .get().then((doc) => {
        if (doc.exists) {
          window.alert("This session ID is already being used. Please enter a new session ID.")
        } else {
          firebase.firestore().collection("sessions").where("externalName", "==", this.state.tempExternalID).get().then((querySnapshot) => {
            if (querySnapshot.empty) {
              this.props.renameSession(this.state.tempExternalID)
            } else {
              window.alert("This session ID is already being used. Please enter a new session ID.")
            }
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
        }
    })

  }

  render() {
    if (!this.state.hasName) {
      return(
        <React.Fragment>
          <this.props.SplashBanner text="Welcome to your what2do session!"/>
          <div className="general">
            <form>
            <label>Log in as: </label>
              <select defaultValue={"DEFAULT"} onChange={this.handleNameChange}>
                {this.state.existingUsers}
              </select>
              <ColorButton
                className ="color-button"
                variant="contained"
                color="primary"
                size="small"
                disableElevation
                onClick={ this.handleNameSubmit }>Go!</ColorButton>
            </form>
            <p>OR</p>
            <form>
              <CustomTextField id="nameInput" label="Enter your name:" variant="outlined" size="small"
                onChange={this.handleNameChange}
                onKeyPress={event => {
                    if (event.key === 'Enter') {
                      this.handleNameSubmit(event)
                    }
                }}/>
              <ColorButton
                className ="color-button"
                variant="contained"
                color="primary"
                size="small"
                disableElevation
                onClick={ this.handleNameSubmit }>Submit</ColorButton>
            </form>
            <br/>
            <UserList
              username = {this.state.username}
              sessionID = {this.props.sessionID}
            />
            <br/>
            <ColorButton
              className ="color-button"
              variant="contained"
              color="primary"
              size="small"
              disableElevation
              onClick={ () => {navigator.clipboard.writeText("http://localhost:3000/" + window.location.search)} }>
              Click to copy session link!
            </ColorButton>
            <br/><br/>
            <form>
              <CustomTextField id="changeExternalID" label="Change session ID:" variant="outlined" size="small"
                onChange={this.handleSessionChange}
                onKeyPress={event => {
                    if (event.key === 'Enter') {
                      this.handleSessionSubmit(event)
                    }
                }}/>
              <ColorButton
                className ="color-button"
                variant="contained"
                color="primary"
                size="small"
                disableElevation
                onClick={ this.handleSessionSubmit }>Submit</ColorButton>
            </form>
            <br/>
            <ColorButton
              className ="color-button"
              variant="contained"
              color="primary"
              size="small"
              disableElevation
              onClick={ this.props.resetSession }>Leave session</ColorButton>
          </div>
        </React.Fragment>
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

import React from 'react';
import firebase from '../firebase';

import {
  createTheme,
  createStyles,
  withStyles,
  makeStyles,
  Theme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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

class CurrentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      voteCount: [],
      didVote: [],
      isLoaded: false
    }
    this.deleteVote = this.deleteVote.bind(this);
    this.addVote = this.addVote.bind(this);
  }

  componentDidMount() {
    var db = firebase.firestore().collection("sessions").doc(this.props.sessionID);
    db.collection("items").orderBy("count", "desc").onSnapshot((querySnapshot) => {
      var localEntries = [];
      var localVoteCount = [];
      var localUserVotes = [];
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data().count);
          localEntries = localEntries.concat(doc.id);
          localVoteCount = localVoteCount.concat(doc.data().count);
          localUserVotes = localUserVotes.concat(doc.data().votes.includes(this.props.username));
      });
      this.setState({
        entries: localEntries,
        voteCount: localVoteCount,
        didVote: localUserVotes,
        isLoaded: true
      })
    });
  }

  deleteVote(e) {
    var db = firebase.firestore().collection("sessions").doc(this.props.sessionID);
    var docName = e.currentTarget.value;
    console.log("Deleting", docName);

    db.collection("items").doc(docName).update({
      count: firebase.firestore.FieldValue.increment(-1),
      votes: firebase.firestore.FieldValue.arrayRemove(this.props.username)
    });

    db.collection("items").doc(docName).get().then((doc) => {
      if (doc.data().count === 0) {
        db.collection("items").doc(docName).delete().then(() => {
          console.log("Document successfully deleted!");
        }).catch((error) => {
          console.error("Error removing document: ", error);
        });
      }
    });
  }

  addVote(e) {
    var docName = e.currentTarget.value;
    console.log("Adding vote", docName);
    this.props.receiveItemInput(docName);
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div>
          <p>
            Current Items:
            <br />
            Loading...
          </p>
        </div>
      )
    } else {
      var displayItems = [];
      for (var i = 0; i < this.state.entries.length; i++) {
        var itemName = this.state.entries[i];
        displayItems.push(
          <li id={i}>
            { itemName } - { this.state.voteCount[i] } votes { this.state.didVote[i] 
              ?
              // <button id={itemName} onClick={this.deleteVote} > Delete </button>
              <ColorButton
                value={itemName}
                className ="color-button"
                variant="contained"
                color="primary"
                size="small"
                disableElevation
                onClick={ this.deleteVote }>Delete</ColorButton>
              : 
              // <button id={itemName} onClick={this.addVote} > Vote </button> 
              <ColorButton
                value={itemName}
                className ="color-button"
                variant="contained"
                color="primary"
                size="small"
                disableElevation
                onClick={ this.addVote }>Vote</ColorButton> }
          </li>
        );
      }

      return (
        <div>
          <p>
            Current Items:
          </p>
          <ul>
            {displayItems}
          </ul>
        </div>
      )
    }
  }
}

export default CurrentList;

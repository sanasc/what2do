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
import Checkbox from '@material-ui/core/Checkbox';

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

const GreenCheckbox = withStyles({
  root: {
    color: "#7CB7AF",
    '&$checked': {
      color: "#16796F",
    },
    padding: "0 0 0 0.5em",
  },
  checked: {},
})(Checkbox);

class CurrentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      voters: [],
      voteCount: [],
      didVote: [],
      isLoaded: false
    }
    this.deleteVote = this.deleteVote.bind(this);
    this.addVote = this.addVote.bind(this);
    this.renderWithVoting = this.renderWithVoting.bind(this);
    this.renderWithoutVoting = this.renderWithoutVoting.bind(this);
  }

  componentDidMount() {
    var db = firebase.firestore().collection("sessions").doc(this.props.sessionID);
    db.collection("items").orderBy("count", "desc").onSnapshot((querySnapshot) => {
      var localEntries = [];
      var localVoteCount = [];
      var localVoters = [];
      var localUserVotes = [];
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data().count);
          localEntries = localEntries.concat(doc.id);
          localVoteCount = localVoteCount.concat(doc.data().count);
          localUserVotes = localUserVotes.concat(doc.data().votes.includes(this.props.username));
          localVoters.push(doc.data().votes);
      });
      this.setState({
        entries: localEntries,
        voters: localVoters,
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
      if (doc.exists && doc.data().count === 0) {
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

  renderWithVoting(){
    var displayItems = [];
    for (var i = 0; i < this.state.entries.length; i++) {
      var itemName = this.state.entries[i];
      displayItems.push(
        <li className="itemList">
          { itemName } - { this.state.voteCount[i] } votes
          { this.state.didVote[i]
            ?
            <GreenCheckbox
              value={itemName}
              checked={this.state.didVote[i]}
              onChange={this.deleteVote} />
            :
            <GreenCheckbox
              value={itemName}
              checked={this.state.didVote[i]}
              onChange={this.addVote} />
          }
          <br/>
          <em>({this.state.voters[i].join(", ")})</em>
        </li>
      );
    }
    return (
      <div className="list">
        <h3>
          Current Items:
        </h3>
        <ul>
          {displayItems}
        </ul>
      </div>
    )
  }

  renderWithoutVoting(){
    var displayItems = [];
    for (var i = 0; i < this.state.entries.length; i++) {
      var itemName = this.state.entries[i];
      displayItems.push(
        <li id={i}>
          { itemName } - { this.state.voteCount[i] } votes
          <br/>
          <em>({this.state.voters[i].join(", ")})</em>
        </li>
      );
    }
    return (
      <div className="list">
        <h3>
          Current Items:
        </h3>
        <ul>
          {displayItems}
        </ul>
      </div>
    )
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
    } else if (this.props.username != null) {
      return <this.renderWithVoting/>;
    }
    else {
      return <this.renderWithoutVoting/>;
    }
  }
}

export default CurrentList;

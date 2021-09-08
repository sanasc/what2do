import React from 'react';
import firebase from '../firebase';

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
    var docName = e.target.id;
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
    var docName = e.target.id;
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
            { itemName } - { this.state.voteCount[i] } votes { this.state.didVote[i] ?
              <button id={itemName} onClick={this.deleteVote} > Delete </button>
              : <button id={itemName} onClick={this.addVote} > Vote </button> }
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

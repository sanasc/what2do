import React from 'react';
import firebase from '../firebase';

class CurrentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      map: [],
      entries: [],
      voteCount: [],
      didVote: [],
      isLoaded: false
    }
    this.deleteVote = this.deleteVote.bind(this);
  }

  componentDidMount() {
    var db = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln");
    db.collection("items").orderBy("count", "desc").onSnapshot((querySnapshot) => {
      var localEntries = [];
      var localVoteCount = [];
      var localUserVotes = [];

      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data().count);
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
    console.log(e.target.id);
    var db = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln");

    db.collection("items").doc(e.target.id).update({
      count: firebase.firestore.FieldValue.increment(-1),
      votes: firebase.firestore.FieldValue.arrayRemove(this.props.username)
    });

    db.collection("items").doc(e.target.id).get().then((doc) => {
      if (doc.data().count == 0) {
        db.collection("items").doc(e.target.id).delete().then(() => {
          console.log("Document successfully deleted!");
        }).catch((error) => {
          console.error("Error removing document: ", error);
        });
      }
    });
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div>
          <p>
            Current Movies:
            <br />
            Loading...

          </p>
        </div>
      )
    } else {
      var displayItems = [];
      for (var i = 0; i < this.state.entries.length; i++) {
        var itemName = this.state.entries[i];
        displayItems.push(<li id={i}>{ itemName } - { this.state.voteCount[i] } votes { this.state.didVote[i] ? <button id={itemName} onClick={this.deleteVote} >Delete</button> : "" } </li>);
      }

      return (
        <div>
          <p>
            Current Movies:
            <br />
            <ul>
              {displayItems}
            </ul>
          </p>
        </div>
      )
    }
  }
}

export default CurrentList;

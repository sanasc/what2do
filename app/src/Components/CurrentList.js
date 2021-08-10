import React from 'react';
import firebase from '../firebase';

class CurrentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      voteCount: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    var db = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln");
    db.collection("items").orderBy("count", "desc").onSnapshot((querySnapshot) => {
      var localEntries = [];
      var localVoteCount = [];
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data().count);
          localEntries = localEntries.concat(doc.id);
          localVoteCount = localVoteCount.concat(doc.data().count);
      });
      this.setState({
        entries: localEntries,
        voteCount: localVoteCount,
        isLoaded: true
      })
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
        displayItems.push(<li>{this.state.entries[i]} - {this.state.voteCount[i]} votes </li>);
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

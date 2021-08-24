import React from 'react';
import firebase from '../firebase';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln")
        .onSnapshot((doc) => {
          var localUsers = [];
          doc.data().users.forEach((user) => {
            localUsers = localUsers.concat(user);
          })
          this.setState({
            users: localUsers
          })
        });
  }

  deleteUser(e) {
    var username = e.target.id;
    if (window.confirm("You are about to delete user " + username + " and all their votes.\nProceed?")) {
      var db = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln");
    
      console.log("Deleting user", username);
      
      db.update({
        users: firebase.firestore.FieldValue.arrayRemove(username)
      });

      console.log("after update");

      db.collection("items").where("votes", "array-contains", username)
        .onSnapshot( (querySnapshot) => {
          console.log(querySnapshot.empty);
          querySnapshot.forEach( (doc) => {
            console.log("votes contains" + username + " ", doc.data());
            db.collection("items").doc(doc.id).update({
              count: firebase.firestore.FieldValue.increment(-1),
              votes: firebase.firestore.FieldValue.arrayRemove(username)
            })
        })
      });

      console.log("after array-contains");

      db.collection("items").where("count", "==", 0)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach( (doc) => {
            db.collection("items").doc(doc.id).delete().then(() => {
              console.log("Document successfully deleted!");
            }).catch((error) => {
              console.error("Error removing document: ", error);
            });
        })
      });
    }     
  }

  render() {
    var displayUsers = [];
    for (var i = 0; i < this.state.users.length; i++) {
      var username = this.state.users[i];
      displayUsers.push(
        <li id={i}>
          {username} <button id={username} onClick={this.deleteUser}> Remove User </button>
        </li>
      );
    }
    return (
      <div>
        <p>
          Users in current session:
        </p>
        <ul>
          {displayUsers}
        </ul>
      </div>
    )
  }

}

export default UserList;

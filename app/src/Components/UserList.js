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

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    firebase.firestore().collection("sessions").doc(this.props.sessionID)
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
    var username = e.currentTarget.value;
    if (window.confirm("You are about to delete user " + username + " and all their votes.\nProceed?")) {
      var db = firebase.firestore().collection("sessions").doc(this.props.sessionID);

      console.log("Deleting user", username);

      db.update({
        users: firebase.firestore.FieldValue.arrayRemove(username)
      });

      console.log("after update");

      db.collection("items").where("votes", "array-contains", username)
        .get().then( (querySnapshot) => {
          console.log(querySnapshot.empty);
          querySnapshot.forEach( (doc) => {
            console.log("votes contains " + username + " ", doc.data());
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
    return (
      <div className="list">
        <h3>
          Users in Current Session:
        </h3>
        <ul>
          {this.state.users.length == 0 ? "No users have joined." : this.state.users.map((eachUser) => {
            return (
              <li key={eachUser}>
                {eachUser}
                <ColorButton
                  value={eachUser}
                  className ="color-button"
                  variant="contained"
                  color="primary"
                  size="small"
                  disableElevation
                  onClick={ this.deleteUser }>Remove User</ColorButton>
              </li>
            );
          })}
        </ul>
      </div>
    )
  }

}

export default UserList;

import React from 'react';
import firebase from '../firebase';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    var db = firebase.firestore().collection("sessions").doc("n4JhCl5XDul2rGHAlJln");
    
    db.get().then((doc) => {
      var localUsers = [];
      doc.data().users.forEach((user) => {
        localUsers = localUsers.concat(user);
      })
      this.setState({
        users: localUsers
      })
    });
  }


  render() {
    var displayUsers = [];
    for (var i = 0; i < this.state.users.length; i++) {
      var username = this.state.users[i];
      displayUsers.push(
        <li id={i}>
          {username}
        </li>
      );
    }
    return (
        <div>
            <p>
            Users in current session:
            <br />
              <ul>
                {displayUsers}
              </ul>
            </p>
        </div>
    )
  }
}

export default UserList;

import React, { Component } from "react";
import "./App.css";
import firebase from './firebase';
import SessionPage from "./Components/SessionPage";

class App extends Component {
  constructor() {
    super();
    this.state = {
      sessionID: null
    };
  }

  componentDidMount () {
    const queryParams = new URLSearchParams(window.location.search);
    const session = queryParams.get('session');
    this.setState({
      sessionID: session
    })
  }

  render() {
    if (this.state.sessionID != null) {
      return (
        <div className="general">
          <SessionPage
            sessionID = { this.state.sessionID }
          />
        </div>
      );
    } else {
      return (
        <div>
          <p>Hi</p>
        </div>
      );
    }

  }
}

export default App;

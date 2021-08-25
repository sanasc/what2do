import React, { Component } from "react";
import "./App.css";
import firebase from './firebase';
import SessionPage from "./Components/SessionPage";

class App extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  componentDidMount () {

  }

  render() {
    return (
      <div className="general">
        <SessionPage/>
      </div>
    );
  }
}

export default App;

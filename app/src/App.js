
import React, { Component } from "react";
import ItemInput from "./Components/ItemInput";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      hasName: false,
      finalInput: []
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange = event => {
    event.preventDefault();
    console.log("hello");
    this.setState({ name:event.target.value });
    console.log(event.target.value);
  }

  handleNameSubmit = event => {
    this.setState({ hasName: true })
  }

  receiveItemInput = currentInput => {
    this.setState({finalInput: this.state.finalInput.concat([currentInput])});
  }

  render() {
    if (!this.state.hasName) {
      return(
        <div>
          <label>Enter your name: </label>
          <form>
            <input type="text" name="usernameValue" id="usernameInput"
              onChange={this.handleNameChange}
              onKeyPress={event => {
                  if (event.key === 'Enter') {
                    this.handleNameSubmit(event)
                  }
                }}/>
            <button onClick={this.handleNameSubmit}>Submit</button>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <ItemInput
            name = {this.state.name}
            receiveItemInput = {this.receiveItemInput}
          />
          <p>
            you've added:
            </p>
            <ul>
            {this.state.finalInput.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }
  }
}

export default App;

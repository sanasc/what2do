import React, { Component } from "react";
import ItemInput from "./Components/ItemInput";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      hasName: false,
      finalInput: [],
      items: new Map()
    };
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange = event => {
    event.preventDefault();
    this.setState({ name:event.target.value });
  }

  handleNameSubmit = event => {
    this.setState({ hasName: true })
  }

  resetName = () => {
    this.setState({
      name: "",
      hasName: false
    })
  }

  receiveItemInput = currentInput => {
    this.setState({finalInput: this.state.finalInput.concat([currentInput])});

    if (this.state.items.size === 0) {
      this.state.items.set(currentInput, [this.state.name]);
    } else {
      if (this.state.items.has(currentInput)) {
        this.state.items.set(
          currentInput,
          this.state.items.get(currentInput).concat([this.state.name])
        );
      } else {
        this.state.items.set(currentInput, [this.state.name]);
      }
    }

    // Print items in items to console
    for (let [key, value] of this.state.items) {
      console.log(key + ' = ' + value);
    }
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
            goBack = {this.resetName}
          />
          <p>
            you've added:
          </p>

        </div>
      );
    }
  }
}

/*
<ul>
  {this.state.finalInput.map(item => (
    <li key={item}>{item}</li>
  ))}
</ul>
*/

export default App;

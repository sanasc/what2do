
import React, { Component } from "react";
import ItemInput from "./Components/ItemInput";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
      finalInput: []
    };
  }

  receiveItemInput = currentInput => {
    this.setState({finalInput: this.state.finalInput.concat([currentInput])});
  }

  render() {
    return (
      <div>
        <ItemInput
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

export default App;

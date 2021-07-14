
import React, { Component } from "react";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
      input: "",
      finalInput: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState({ input:event.target.value });
  }

  handleClick(event) {
    console.log(this.state.input);
    this.setState({finalInput:this.state.input});
  }

  render() {
    return (
      <div>
        <label>Enter value: </label>
        <form>
          <input type="textarea" name="textValue" onChange={this.handleChange}/>

        </form>
        <button onClick={this.handleClick}>Submit</button>

        <p id="resultText">{this.state.finalInput}</p>
      </div>
    );
  }
}

export default App;

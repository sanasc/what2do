
import React, { Component } from "react";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
      input: "",
      finalInput: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState({ input:event.target.value });
  }

  handleClick(event) {
    event.preventDefault();
    console.log(this.state.input);
    document.getElementById('userinput').value = '';
    this.setState({finalInput: this.state.finalInput.concat([this.state.input])});
  }

  render() {
    return (
      <div>
        <label>Enter value: </label>
        <form>
          <input type="textarea" name="textValue" id="userinput"
            onChange={this.handleChange}
            onKeyPress={event => {

                if (event.key === 'Enter') {
                  this.handleClick(event)
                }
              }}/>
          <button onClick={this.handleClick}>Submit</button>
        </form>

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

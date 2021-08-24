import React from 'react'

class ItemInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentInput: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendItemInput = this.sendItemInput.bind(this);
  }

  handleChange(event) {
    this.setState({ currentInput:event.target.value });
  }

  sendItemInput = event => {
    event.preventDefault();
    console.log(this.state.currentInput);
    document.getElementById('userinput').value = '';
    this.props.receiveItemInput(this.state.currentInput);
  }

  render() {
    return (
      <div>
        <button onClick={this.props.goBack}>Go back</button>
        <br />
        <br />
        <label>{this.props.name}, enter value: </label>
        <form>
          <input type="textarea" name="textValue" id="userinput"
            onChange={this.handleChange}
            onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.sendItemInput(event)
                }
              }}/>
          <button onClick={this.sendItemInput}>Submit</button>
        </form>
        
      </div>
    );
  }
}

export default ItemInput;

import React from 'react'

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
        <ColorButton
          className ="color-button"
          variant="contained"
          color="primary"
          size="small"
          disableElevation
          onClick={ this.props.goBack }>Go back</ColorButton>
        <br />
        <br />
        <label>{this.props.username}, enter value: </label>
        <form>
          <input type="textarea" name="textValue" id="userinput"
            onChange={this.handleChange}
            onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.sendItemInput(event)
                }
              }}/>
          <ColorButton
            className ="color-button"
            variant="contained"
            color="primary"
            size="small"
            disableElevation
            onClick={ this.sendItemInput }>Submit</ColorButton>
        </form>

      </div>
    );
  }
}

export default ItemInput;

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
import TextField from '@material-ui/core/TextField';

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

const CustomTextField = withStyles((theme) => ({
  root: {
    minWidth: "15em",
    '& label.Mui-focused': {
      color: "#16796F",
    },
    '& input:valid + fieldset': {
      borderColor: "#7CB7AF",
      borderWidth: 2,
    },
    '& input:invalid + fieldset': {
      borderColor: "#16796F",
      borderWidth: 2,
    },
    '& input:valid:focus + fieldset': {
      borderLeftWidth: 6,
      borderColor: "#16796F",
      textColor: "#16796F",
      padding: '4px !important',
    },
  },
}))(TextField);

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
        <form>
          <CustomTextField 
            id="userinput" 
            label={this.props.username + ", enter an item:"}  
            variant="outlined" 
            size="small"
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

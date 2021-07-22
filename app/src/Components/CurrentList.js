import React from 'react'

class CurrentList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var entries = [];
      for (let [key, value] of this.props.items) {
        entries = entries.concat([key + ": " + value, <br/>]);
    }
    return (
      <div>
        <p>
          Current Movies:
          <br />
          {entries}
        </p>
      </div>
    )
  }
}

export default CurrentList;
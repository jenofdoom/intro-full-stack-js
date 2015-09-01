var ReturnToLobby = React.createClass({
  onClick: function() {
    this.props.returnToLobby();
  },
  render: function() {
    return (
      <button className="home" type="button" onClick={this.onClick}>{this.props.text}</button>
    );
  }
});

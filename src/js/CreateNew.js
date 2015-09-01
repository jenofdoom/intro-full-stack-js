var CreateNew = React.createClass({
  onClick: function() {
    socket.emit('new room');
  },
  render: function() {
    return (
      <button className="newRoom" type="button" onClick={this.onClick}>Create</button>
    );
  }
});

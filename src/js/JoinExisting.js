var JoinExisting = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
    var hash = React.findDOMNode(this.refs.code).value.trim();
    if (hash) {
      socket.emit('join room', hash);
      React.findDOMNode(this.refs.code).value = '';
    }
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Room code: <input ref="code" autoComplete="off" /></label>
        <button>Connect</button>
      </form>
    );
  }
});

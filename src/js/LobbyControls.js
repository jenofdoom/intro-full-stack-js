var LobbyControls = React.createClass({
  render: function() {
    var lobbyClass = "";

    if (!this.props.showLobby) {
      lobbyClass = "hidden";
    }

    return (
      <div className={lobbyClass}>
        <h2>You are not in a room</h2>
        <p>Enter an existing room:</p>
        <JoinExisting />
        <p>Or create a new one:</p>
        <CreateNew />
      </div>
    );
  }
});

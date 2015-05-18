var App = React.createClass({
  getInitialState: function() {
    return {
      showLobby: false,
      showRoom: false
    };
  },
  componentDidMount: function() {
    var reactApp = this;

    socket.on('join room', function(roomData){
      if (roomData && roomData.active) {
        reactApp.setState({
          showLobby: false,
          showRoom: true,
          roomId: roomData.hash
        });
      }
    });

    reactApp.setState({showLobby: true});
  },
  render: function() {
    return (
      <div>
        <Room showRoom={this.state.showRoom} roomId={this.state.roomId} />
        <LobbyControls showLobby={this.state.showLobby}/>
      </div>
    );
  }
});

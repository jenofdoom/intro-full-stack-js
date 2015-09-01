var NoRoom = React.createClass({
  returnToLobby: function () {
    // pass up callback to parent
    this.props.returnToLobby();
  },
  render: function() {
    var noRoomClass = "";
    if (!this.props.showNoRoom) {
      noRoomClass = "hidden";
    }
    return (
      <div className={noRoomClass}>
        <p>This room does not exist.</p>
        <ReturnToLobby text="Click on this button to return to the lobby" returnToLobby={this.returnToLobby} />
      </div>
    );
  }
});

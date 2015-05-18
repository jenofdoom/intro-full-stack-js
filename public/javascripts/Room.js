var Room = React.createClass({
  returnToLobby: function () {
    // pass up callback to parent
    this.props.returnToLobby();
  },
  render: function() {
    var roomClass = "";
    var answers = [];
    var question = this.props.question ? this.props.question : this.props.noQuestion;

    if (this.props.answers) {
      for(var key in this.props.answers) {
        if (this.props.answers.hasOwnProperty(key)) {
          answers.push(
            <button key={key} value={key}>
              {key}
            </button>
          );
        }
      }
    }

    if (!this.props.showRoom) {
      roomClass = "hidden";
    }

    return (
      <div className={roomClass}>

        <ReturnToLobby text="Back to lobby" returnToLobby={this.returnToLobby} />

        <h2>Room: {this.props.roomId}</h2>

        <OwnerControls isOwner={this.props.isOwner} roomId={this.props.roomId} />

        <h3>{question}</h3>

        <div className="answers">{answers}</div>

      </div>
    );
  }
});

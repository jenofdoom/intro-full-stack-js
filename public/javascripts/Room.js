var Room = React.createClass({
  render: function() {
    var roomClass = "";

    if (!this.props.showRoom) {
      roomClass = "hidden";
    }

    return (
      <div className={roomClass}>

        <h2>Room: {this.props.roomId}</h2>

      </div>
    );
  }
});

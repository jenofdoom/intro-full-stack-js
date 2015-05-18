var NoRoom = React.createClass({
  render: function() {
    var noRoomClass = "";
    if (!this.props.showNoRoom) {
      noRoomClass = "hidden";
    }
    return (
      <div className={noRoomClass}>
        <p>This room does not exist.</p>
      </div>
    );
  }
});

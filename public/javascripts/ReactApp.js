var App = React.createClass({
  getInitialState: function() {
    return {
      showLobby: false,
      showNoRoom: false,
      showRoom: false
    };
  },
  componentDidMount: function() {
    var reactApp = this;
    var initialUrl = document.location.pathname.substring(1); // remove preceeding /

    socket.on('join room', function(roomData, isOwner){
      window.scrollTo(0, 0);

      if (roomData && roomData.active) {
        reactApp.setState({
          showLobby: false,
          showRoom: true,
          roomId: roomData.hash,
          roomOwner: isOwner,
          question: roomData.question,
          answers: roomData.answers
        });

        window.history.pushState(
          {"room": roomData.hash},
          "Room " + roomData.hash,
          roomData.hash
        );

        if (roomData.answers) {
          reactApp.chartAddColumns(roomData.answers);
        }

      } else {
        reactApp.setState({
          showLobby: false,
          showNoRoom: true
        });
      }
    });

    socket.on('set question', function(roomId, question, answers){
      if (roomId === reactApp.state.roomId) {
        reactApp.setState({
          question: question,
          answers: answers
        });

        // clear the chart and repopulate
        reactApp.chartClear();
        reactApp.chartAddColumns(answers);
      }
    });

    socket.on('vote', function(roomData){
      if (roomData.hash === reactApp.state.roomId) {
        reactApp.setState({
          answers: roomData.answers
        });

        // iterate though chart & update values as necessary
        reactApp.chartUpdate(roomData.answers);
      }
    });

    // try to join/create room via url hash on init
    if (initialUrl) {
      socket.emit('join room', initialUrl);
    } else {
      reactApp.setState({showLobby: true});
    }
  },
  chartAddColumns: function(answers) {
    for(var key in answers) {
      if (answers.hasOwnProperty(key)) {
        // add the chart data
        answerChart.addData([answers[key]], key);
      }
    }
  },
  chartClear: function() {
    var oldData = answerChart.datasets[0].bars.length;
    var loop = 0;
    while (loop < oldData) {
      loop = loop + 1;
      // have to loop because it only removes one column
      answerChart.removeData();
    }
  },
  chartUpdate: function(answers) {
    answerChart.datasets[0].bars.forEach(function(element) {

      // make sure answers[element.label] exists before trying to update
      if (answers.hasOwnProperty(element.label) && (answers[element.label] != element.value)) {
        element.value = answers[element.label];
        answerChart.update();
      }
    });
  },
  returnToLobby: function() {
    window.history.pushState({"room": null}, "Home", "/");
    window.scrollTo(0, 0);

    this.setState({
      showLobby: true,
      showNoRoom: false,
      showRoom: false,
      roomId: null,
      isOwner: false,
      question: null,
      answers: null
    });

    // scrap any existing data in the chart
    this.chartClear();
  },
  render: function() {
    return (
      <div>
        <Room showRoom={this.state.showRoom} roomId={this.state.roomId} isOwner={this.state.roomOwner} question={this.state.question} answers={this.state.answers} noQuestion="A question has not yet been set" returnToLobby={this.returnToLobby} />
        <LobbyControls showLobby={this.state.showLobby}/>
        <NoRoom showNoRoom={this.state.showNoRoom} returnToLobby={this.returnToLobby} />
      </div>
    );
  }
});

var OwnerControls = React.createClass({
  getInitialState: function() {
    return {
      controlsOn: true
    };
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var question = React.findDOMNode(this.refs.question).value.trim();

    if (question) {
      var answer1 = React.findDOMNode(this.refs.answerOption1).value.trim();
      var answer2 = React.findDOMNode(this.refs.answerOption2).value.trim();
      var data = {"question": question, answers: {}};

      if (answer1 && answer2 && (answer1 !== answer2)) {
        data.answers[answer1] = 0;
        data.answers[answer2] = 0;

        socket.emit('set question', data, this.props.roomId);

        React.findDOMNode(this.refs.question).value = '';
        React.findDOMNode(this.refs.answerOption1).value = '';
        React.findDOMNode(this.refs.answerOption2).value = '';

        this.setState({
          controlsOn: false
        });
      }
    }
  },
  toggleControls: function(event) {
    event.preventDefault();
    this.setState({
      controlsOn: true
    });
  },
  render: function() {
    var ownerClass, toggleClass, controlsClass = "";

    if (!this.props.isOwner) {
      ownerClass = "hidden";
    }

    if (this.state.controlsOn) {
      toggleClass = "hidden";
    } else {
      controlsClass = "hidden";
    }

    return (
      <div className={ownerClass}>
        <p>
          You are the owner of this room. <a className={toggleClass} href="#" onClick={this.toggleControls}>Set question.</a>
        </p>

        <div className={controlsClass}>

          <form onSubmit={this.handleSubmit}>
            <label>Question: <input ref="question" autoComplete="off" /></label>

            <fieldset>
              <legend>Answer options:</legend>

              <label>
                Answer: <input autoComplete="off" ref="answerOption1" />
              </label>

              <label>
                Answer: <input autoComplete="off" ref="answerOption2" />
              </label>

            </fieldset>

            <button>Set</button>
          </form>
        </div>

      </div>
    );
  }
});

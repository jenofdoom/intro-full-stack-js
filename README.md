# Introduction to Full Stack JS
## Node.js, Socket.IO and React

During the tutorial we're going to be working on building a small classroom voting application using Node, Express, Sockets.io, React and Chart.js

You will need to have at least a basic level of JavaScript in order to be able to participate - if you're not sure if you do, then work through [this tutorial](https://developer.mozilla.org/en-US/Learn/Getting_started_with_the_web/JavaScript_basics) to get up to speed first.

## Before the tutorial

If you'd like to follow along during the tutorial, there are a few things you'll need to set up in advance.

### Clone this repository

If you have your own github account already, you might prefer to fork this repository and clone that instead. If you don't just run the following commands on a terminal or command line interface:

    git clone https://github.com/jenofdoom/intro-full-stack-js.git
    cd intro-full-stack-js

If you don't already have git installed on your machine, the above won't work: you can will need to [install git](https://git-scm.com/downloads) first.

### Install node, npm and bower

First, we need to install [node.js](https://nodejs.org/) and its package manager, npm.

[Windows instructions](http://blog.teamtreehouse.com/install-node-js-npm-windows)

[Mac instructions](http://blog.teamtreehouse.com/install-node-js-npm-mac)

[Ubuntu/Debian/Mint instructions](https://rtcamp.com/tutorials/nodejs/node-js-npm-install-ubuntu/)

Once that's done, we can install [Bower](http://bower.io/) using npm. We want to install Bower globally (for more than just this project), so we use a `-g` flag. Note that if you have difficulty installing Bower it might be because you need to install it with administrator permissions - rerun the command with `sudo` in front.

    npm install -g bower

### Install our dependencies

Now we've got npm and bower set up, we can use the `package.json` and `bower.json` files that are already set up in the project to install all the other packages we are going to be using. Have a look at those two files to see what things we are grabbing.

Run the following two commands (from inside the `intro-full-stack-js` directory):

    npm install
    bower install

And you're all set! We'll pick up from this point.

## Building the application

We're going to build a classroom voting application. We'll be using JavaScript both on the server side (Node, Express, Socket.IO) and on the client side (React, Chart.js, and the Socket.IO client side library).

The master branch of this repo is of the 'start point' for the tutorial. If you would like to see the finished version of the code then do `git checkout finished`. Feel free to have a look around (and you can run `node app.js` to see the running final application), but to work on the tutorial we want to jump back to the master branch using `git checkout master`.

### Serving index.html

We'll need a web server in order to serve our stub index.html file properly. Create a file called `app.js` in the root folder of the application with the following code:

```js
var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('public'));

app.get('*', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
```

Now, on the command line we should be able to run `node app.js` and get back a message saying `listening on *:3000`. If you navigate to [localhost:3000](http://localhost:3000/) in a browser you should see the title of our application in a grey font (because the basic stylesheet is being served correctly).

#### Important note

When you makes changes to `app.js` you will have to restart the server before they will take effect. In your terminal where the `node app.js` process is running, exit by pressing `Control-C`. Then run `node app.js` again.

### Communicating via sockets

(do `git checkout step-1` if you want to jump to this point)

Socket.io lets us respond to immediately to events happening in users browsers. Each socket connection is one user's connection to the server. Each user has a unique socket ID, too. To start using socket.io we need to add the server side library (the client side library is already included in `index.html`) to our application - add the following line near the top of `app.js`, underneath the `var http = require('http').Server(app);` line:

```js
var io = require('socket.io')(http);
```

Let's log whenever a user connects to our server via a socket, by adding the following to the bottom of our `app.js` file:

```js
io.on('connection', function(socket){
  console.log('a user connected, ' + io.engine.clientsCount + ' total user(s)');

  socket.on('disconnect', function(){
    console.log('a user disconnected, ' + io.engine.clientsCount + ' total user(s)');
  });
});
```

When you refresh the page, you should see a message about a user connecting. If you open the page in another tab or browser you should see the number of users go up to two. And every time you refresh the page from now on, you should get a message about a user disconnecting, then connecting again.

### Building our first react component

(do `git checkout step-2` if you want to jump to this point)

There's not much to see yet - let's add a component to our client side page. In `index.html`, underneath the H1 tag, add an empty div that we will be inserting our react component into:

```html
<div id="content"></div>
```

React and its JSX compiler are already included at the bottom of the file, but we should also add a file for us to put our custom code in. Because react is designed to be modular, we will create a file for each component. Let's make a component for our lobby, where users will be able to create new rooms or join existing ones. Make a file called `LobbyControls.js` in `public/javascripts` and give it the following contents:

```js
var LobbyControls = React.createClass({
  render: function() {
    return (
      <div>
        <h2>You are not in a room</h2>
        <p>Enter an existing room:</p>
        <button>button goes here</button>
        <p>Or create a new one:</p>
        <button>button goes here</button>
      </div>
    );
  }
});
```

We also need to include our new file in `index.html`, and bootstrap the react component. At the bottom of `index.html`, just before the `</body>`, add the following:

```html
<script src="javascripts/LobbyControls.js" type="text/jsx"></script>
<script type="text/jsx">
React.render(
  <LobbyControls />,
  document.getElementById('content')
);
</script>
```

When you refresh the page you should see the elements being rendered.

### Creating a room

(do `git checkout step-3` if you want to jump to this point)

Let's make that bottom button do something. First we need to make a control to trigger the room creation, and then we need to actually make the room on the server side.

#### Adding the create room button

We'll make the button into its own component, so if we wanted we could use it elsewhere in our application. Make a new file in `public/javascripts` called `CreateNew.js` and link to it from the bottom of `index.html`, like you did with the last component. Give it the following contents:

```js
var CreateNew = React.createClass({
  onClick: function() {
    console.log('clicked');
  },
  render: function() {
    return (
      <button className="newRoom" type="button" onClick={this.onClick}>Create</button>
    );
  }
});
```

So far, that hasn't changed anything. We need to include our new component - we can plug it directly into our `LobbyControls` component. Alter `LobbyControls.js` so that the new component is referenced like so:

```html
<p>Or create a new one:</p>
<CreateNew />
```

When you click the button you should get a `clicked` message in the console.

#### Actually creating the room

In our `OnClick` method in `CreateNew` we want to replace the console.log statement with some socket.io code to communicate via a socket to the backend. First, let's add a better way of referencing the socket.io library to the top of the script block we have in `index.html`:

```js
<script type="text/jsx">
var socket = io.connect();

React.render(
  // ...etc...
```

Now in `CreateNew.js`, replace the `console.log('clicked');` line:

```js
socket.emit('new room');
```

Great, now we're sending a signal via a socket... but the backend isn't doing anything with it yet. In `app.js`, **inside** our `io.on('connection', function(socket){` function, we want to create a new `socket.on` function (like our disconnect one):

```js
socket.on('new room', function(){
  console.log('room created');
});
```

Now (after restarting the node server, remember) whenever you click the button you should get a message in the server output.

How are we actually going to store information about the rooms so that other users can access it too? In real life we'd probably want to write out to a database, but for this we'll just create an array of rooms on the server. The downside is that every time we restart the server we'll lose our rooms (and it won't scale nicely for thousands of rooms), but neither of those things matter very much right now.

In `app.js`, create a variable at the application level so all our later code can referfence it - add the following line **before** `io.on('connection', function(socket){`

```js
var rooms = [];
```

Now we can alter our new room function in `app.js` to actually write something into this array:

```js
socket.on('new room', function(){
  var id = rooms.length;
  var newRoom = {
    "id": id,
    "owner": socket.id,
    "active": true,
    "question": null,
    "answers": null
  };

  rooms.push(newRoom);

  console.log('room created', newRoom);
});
```

Notice that we're giving each room a unique ID based on its position in the array (this is assuming we never remove old rooms from our array, we just mark them as no longer active).

Numeric values aren't a very nice way of referring to rooms, perhaps we can replace them with a hash instead. To do so we'll use another npm package called [hashids](https://www.npmjs.com/package/hashids). We can include hashids (which already got installed via our npm install before we started) in our `app.js` file by adding the following at the top of the file where we set up the other libraries:

```js
var Hashids = require("hashids"),
    hashPadding = 10000,
    hashids = new Hashids("my random text goes here change this if you like");
```

The padding is just to make the hashed value a bit longer. Now we can modify our new room setup to use the hashes:

```js
var id = rooms.length;
var hash = hashids.encode(id + hashPadding);
var newRoom = {
  "id": id,
  "hash": hash,
// ...etc...
```

We also need to make it so that while the application is running, users that are in the same room have a way of communicating without sending signals to users that *aren't* in the room. Add the following line above the console.log in the new room function:

```js
socket.join(hash);
```

### Displaying the new room

Now that we have more than just a lobby we want to show, it makes sense to replace `<LobbyControls />` as the main component we are rendering. We will replace it with a component we will call "App", which will control if the user is current in the lobby or in a room, and show or hide components as necessary.

#### Adding an app component

Create a new component file called `ReactApp.js` and link to it from `index.html`. Put the following in that file:

```js
var App = React.createClass({
  render: function() {
    return (
      <div>
        <LobbyControls />
      </div>
    );
  }
});
```

Replace `<LobbyControls />` in the script at the bottom of `index.html` with `<App />`. That should work just the same as it did before.

We aren't going to want to show the lobby all the time though, so we are going to need to add a way of turning it on or off.

```js
var App = React.createClass({
  getInitialState: function() {
    return {
      showLobby: false,
      showRoom: false
    };
  },
  componentDidMount: function() {
    this.setState({showLobby: true});
  },
  render: function() {
    // ...etc...
```

You can see in the above code, we're doing some setup by plumbing a variable into LobbyControls (that we aren't utilising in that component, yet) to say whether that component should be displayed. When our app initialises, our two state variables are false. When the component has compiled (componentDidMount) we set the lobby state variable to true.

We need to explicitly hand our new state variable down to the lobby component. Alter the `<LobbyControls />` in the render method so that it has an attribute which the variable is written out into (we could call this variable whatever we like but calling it the same thing is less confusing):

```js
<LobbyControls showLobby={this.state.showLobby} />
```

We aren't using that anywhere yet in the lobby component, but it won't matter until we need to be able to hide it.

#### Adding a room component

Create a new component file called `Room.js` and link to it from `index.html`. Put the following in that file:

```js
var Room = React.createClass({
  render: function() {
    return (
      <div>

        <h2>Room:</h2>

      </div>
    );
  }
});
```

Add a `<Room />` tag into the render method of the App component, next to the LobbyControls one, and pass it the showRoom state variable:

```js
<div>
  <Room showRoom={this.state.showRoom} />
  <LobbyControls showLobby={this.state.showLobby} />
</div>
```

Note that now there is more than one element we need to wrap them in a div for the render to be able to append them correctly.

Now we need to use the showRoom variable to actually alter what gets rendered in the room component:

```js
var Room = React.createClass({
  render: function() {
    var roomClass = "";

    if (!this.props.showRoom) {
      roomClass = "hidden";
    }

    return (
      <div className={roomClass}>

        <h2>Room:</h2>

      </div>
    );
  }
});
```

There is some JavaScript code in the render method to work out if we should add a class of `hidden` to the div (the styling is already set up for this class in `main.css`), based on data passed down from the App component.

Note that on the App component we're using state, which is mutable, whereas in Room we're using props (which is set up automatically from state) because the variable should be immutable within this component.

#### Showing the room component when it is created

We need to add something to our server side application to make it communicate back to our client side application when a room is created. In `app.js` (the server-side one!) add a line to the bottom of the new room function:

```js
io.to(socket.id).emit('join room', newRoom);
```

This will send a message back to the particular user that triggered the event only - we don't want to put everyone into the room! We send a signal back to the client side, with the room details along with it.

On the client side, we need a place to catch these signals. This must be code that is set up from the start of the application being intialised, so let's add it to `componentDidMount` in `ReactApp.js`:

```js
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
```

Note that we have to set up a variable called `reactApp` so we can refer to react's methods within App (because within a `socket.on` function `this` will be redefined).

Now when we restart the server and refresh the page, when we click create room we should be shown the room component.

#### Hiding the lobby

```js
var LobbyControls = React.createClass({
  render: function() {
    var lobbyClass = "";

    if (!this.props.showLobby) {
      lobbyClass = "hidden";
    }

    return (
      <div className={lobbyClass}>
        <h2>You are not in a room</h2>
```

#### Passing data in to the room

`ReactApp.js`:
```js
<Room showRoom={this.state.showRoom} roomId={this.state.roomId} />
```

`Room.js`:
```js
<h2>Room: {this.props.roomId}</h2>
```

### Letting others join the room

It's no good having a room if others can't join it!

#### via lobby

Let's build out the controls to join a room in the lobby. Create a new component file called `JoinExisting.js` and link to it from `index.html`. Don't forget to add your new component into the render method in `LobbyControls.js`. Put the following into `JoinExisting.js`:

```js
var JoinExisting = React.createClass({
  handleSubmit: function(event) {

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
```
Here we create a form with a submit action that will trigger the `handleSubmit` method on JoinExisting. Now we can add some code to that method:

```js
event.preventDefault();
var hash = React.findDOMNode(this.refs.code).value.trim();
if (hash) {
  socket.emit('join room', hash);
  React.findDOMNode(this.refs.code).value = '';
}
```

First we prevent the form submit from doing a POST and refreshing the page. Then we fish the user provided value out of the form using findDOMNode on the form element's ref attribute. If it's set, we send a message to the backend and reset the value to empty.

##### Handling the join room message

On the backend, we need to set up a listener for the `join room` signal. In `app.js`, below our new room function, add in the following:

```js
socket.on('join room', function(hash){
  var id = hashids.decode(hash) - hashPadding;
  var result = rooms[id];

  socket.join(hash);

  io.to(socket.id).emit('join room', result);
});
```

On the client side, everything should already be taken care of, because we're reusing the same join room signal.

#### via url

It would be nice to be able to be able to jump straight to a particular room by just entering a url to it directly. This is quite easy with html5push state. When we join a room, we should push the state, like so:

`ReactApp.js`, in `componentDidMount`'s `join room`:
```js
window.history.pushState(
  {"room": roomData.hash},
  "Room " + roomData.hash,
  roomData.hash
);
```

When the page loads, if there is a hash already set in the url we should treat it as if the user tried to enter that room.

`ReactApp.js`, replace the line `reactApp.setState({showLobby: true});` in `componentDidMount`:
```js
var initialUrl = document.location.pathname.substring(1); // remove preceeding /

if (initialUrl) {
  socket.emit('join room', initialUrl);
} else {
  reactApp.setState({showLobby: true});
}
```

We also need to reset the url when the user goes back to the lobby, but we don't have a way of going back to the lobby yet so we'll worry about that later!

#### if they get the hash wrong

If the user tries to look up a room that doesn't exist, nothing will happen. We should have a nicer error message than that. Let's make a component to display instead of the lobby when there is no room found.

Create a new component file called `NoRoom.js` and link to it from `index.html`, with the following contents:

```js
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
```

Now we need to add this component to `ReactApp.js`, and set some initial state so it is not shown until we need it.

```js
getInitialState: function() {
  return {
    showLobby: false,
    showNoRoom: false,
    showRoom: false
  };
},
```

And add our new component to the render method:

```js
<NoRoom showNoRoom={this.state.showNoRoom} />
```

We also need to alter the join room function in `ReactApp.js`, so that the `if (roomData && roomData.active) {` clause now has an else block:

```js
if (roomData && roomData.active) {
  // ...etc...
} else {
  reactApp.setState({
    showLobby: false,
    showNoRoom: true
  });
}
```

### Setting a question and answers

Of course it's no good having a room if we can't do anything in it. The user who started the room is the room owner. They should have some special controls for setting a question and the answers to go along with it.

#### Figuring out is a user is the room owner

We need the backed to validate if a user is an owner. Let's modify our `join room` signals on the backend to pass back that information. In `app.js`, modify the `join room` and `new room` functions:

```js
socket.on('new room', function(){
  // ...etc...
  io.to(socket.id).emit('join room', newRoom, true);
});
```
```js
socket.on('join room', function(hash){
  var id = hashids.decode(hash) - hashPadding;
  var result = rooms[id];
  var isOwner = false;

  if (result && (result.owner === socket.id)) {
    isOwner = true;
  }
  socket.join(hash);
  io.to(socket.id).emit('join room', result, isOwner);
});
```

Now in the corresponding `join room` function in `ReactApp.js` on the client side, we can pick up the new parameter and put it in the state:

```js
socket.on('join room', function(roomData, isOwner){
  if (roomData && roomData.active) {
    reactApp.setState({
      showLobby: false,
      showRoom: true,
      roomId: roomData.hash,
      roomOwner: isOwner
    });
  // ...etc...
```

We should then pass this down to the room component:

```js
<Room
  showRoom={this.state.showRoom}
  roomId={this.state.roomId}
  isOwner={this.state.roomOwner}
/>
```

In `Room.js` we want to add a new component that we will hand off the roomOwner state to, under the h2:

```js
<OwnerControls
  isOwner={this.props.isOwner}
  roomId={this.props.roomId}
/>
```

#### Showing the room controls

Create a new component file called `OwnerControls.js` and link to it from `index.html`, with the following contents:

```js
var OwnerControls = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();
  },
  render: function() {
    var ownerClass = "";

    if (!this.props.isOwner) {
      ownerClass = "hidden";
    }

    return (
      <div className={ownerClass}>
        <p>
          You are the owner of this room.
        </p>

        <div>

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
```

This sets up the controls. They will display when you are the owner of a room you are viewing. Let's alter the component so the controls hide themselves when the set button is pressed. They can be shown again by clicking on a link:

```js
var OwnerControls = React.createClass({
  getInitialState: function() {
    return {
      controlsOn: true
    };
  },
  toggleControls: function(event) {
    event.preventDefault();
    this.setState({
      controlsOn: true
    });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    this.setState({
      controlsOn: false
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

        // ...etc...
```

#### Passing the server the question and answers

As yet nothing much happens on pressing the button  - let's add some code to the `handleSubmit` method:

```js
handleSubmit: function(event) {
  event.preventDefault();
  var question = React.findDOMNode(this.refs.question).value.trim();

  if (question) {
    var answer1 = React.findDOMNode(this.refs.answerOption1).value.trim();
    var answer2 = React.findDOMNode(this.refs.answerOption1).value.trim();
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
```

Now we need to catch `set question` on the server and handle it.

#### Setting the question and answers

In the server file `app.js`, add another listener function:

```js
socket.on('set question', function(data, hash){
  var id = hashids.decode(hash) - hashPadding;
  var room = rooms[id];

  if (room && (room.owner === socket.id)) {
    room.question = data.question;
    room.answers = data.answers;

    io.to(hash).emit('set question', room.hash, room.question, room.answers);
  }
});
```

In the client side `ReactApp.js`, add another function in `componentDidMount`:

```js
socket.on('set question', function(roomId, question, answers){
  if (roomId === reactApp.state.roomId) {
    reactApp.setState({
      question: question,
      answers: answers
    });
  }
});
```

We also need to modify the `join room` setState object so that when we're joining a room we pull out any existing set question and answers:

```js
socket.on('join room', function(roomData, isOwner){
  if (roomData && roomData.active) {
    reactApp.setState({
      showLobby: false,
      showRoom: true,
      roomId: roomData.hash,
      roomOwner: isOwner,
      question: roomData.question,
      answers: roomData.answers
    });
```

We need to pass this data down to the Room component, and while we're at it let's add a placeholder for when a question hasn't yet been set:

```js
<Room showRoom={this.state.showRoom} roomId={this.state.roomId} isOwner={this.state.roomOwner} question={this.state.question} answers={this.state.answers} noQuestion="A question has not yet been set" />
```

We should reflect this new information in `Room.js`. In the JavaScript before the return statement we want to do a bit of setup:

```js
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
```

In the return statement itself we want to add the following JSX:

```js
<h3>{question}</h3>

<div className="answers">{answers}</div>
```

You might also wish to add a smidge of css to `main.css` to space the buttons out better:

```css
.answers button {
  margin-right:10px;
}
```

### Going back to the lobby

Right now it's kinda annoying to switch rooms. Let's add a button component, for returning to the lobby. We should put it in every room, and also on the no room page.

Create a new component file called `ReturnToLobby.js` and link to it from `index.html`. Put the following in that file:

```js
var ReturnToLobby = React.createClass({
  onClick: function() {
    this.props.returnToLobby();
  },
  render: function() {
    return (
      <button className="home" type="button" onClick={this.onClick}>{this.props.text}</button>
    );
  }
});
```

This seems fairly straightforwards, other than the fact that the onClick sets a property that is a function - what happens with that? It triggers a function on the parent component. Why does it need to do that? Because all of the interesting things we'd want to do to turn the lobby back on actually live in `ReactApp.js` - but in order to get back to that we're going to have to hop back up via all the intermediate steps.

We haven't actually set up the parent yet, so let's do that now. We want to add the button into `Room.js`, before the h2 (this is also where we set up the text for the button):

```js
<ReturnToLobby text="Back to lobby" returnToLobby={this.returnToLobby} />
```

Let's also set up the function that the onClick triggered, by adding a `returnToLobby` method in `Room.js`:

```js
returnToLobby: function () {
  // pass up callback to parent
  this.props.returnToLobby();
},
```

And finally in `ReactApp.js` we can set up a method to actually do the interesting things:

```js
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
},
```

This is basically setting everything back to a neutral state. In order for this to work, though, there is one other thing that we need to do - make sure we pass this function down the chain for `Room` to act on - and let's do the same for `NoRoom` while we're here:

```js
<Room showRoom={this.state.showRoom} roomId={this.state.roomId} isOwner={this.state.roomOwner} question={this.state.question} answers={this.state.answers} noQuestion="A question has not yet been set" returnToLobby={this.returnToLobby} />
<LobbyControls showLobby={this.state.showLobby}/>
<NoRoom showNoRoom={this.state.showNoRoom} returnToLobby={this.returnToLobby} />
```

Plugging the button into `NoRoom` is as simple as adding the `returnToLobby` method there, as well as the component tag itself (this time with different text).

```js
returnToLobby: function () {
  // pass up callback to parent
  this.props.returnToLobby();
},

// ...etc...

<ReturnToLobby text="Click on this button to return to the lobby" returnToLobby={this.returnToLobby} />
```

### Letting people vote

Currently the answer buttons do nothing when clicked. Let's wire them up. Add `onClick={this.vote}` to the `<button>` tag in `Room.js`, then create a method called `vote`:

```js
vote: function(event) {
  socket.emit('vote', event.target.value, this.props.roomId);
},
```

Note that we have to do a bit of fishing around in the event to find out which button was clicked. We could have instead of set up a separate method for each button, but this is more flexible.

On the server side, we need to accept the `vote` event and add it to the data for that room.

`app.js`:
```js
socket.on('vote', function(answer, hash) {
  var id = hashids.decode(hash) - hashPadding;
  var room = rooms[id];

  if (room && (room.answers.hasOwnProperty(answer))) {
    room.answers[answer] = room.answers[answer] + 1;
    console.log('vote for ' + answer + ' in ' + room.hash);
    io.to(hash).emit('vote', room);
  }
});
```

On the client side, again we need to set up a listener in `ReactApp.js`'s `componentDidMount`:

```js
socket.on('vote', function(roomData){
  if (roomData.hash === reactApp.state.roomId) {
    reactApp.setState({
      answers: roomData.answers
    });
  }
});
```

In this fashion the answers totals are propagated down via the state to the Room.

### Displaying the vote results

Finally, let's display our results as a graph. We could build a react component to wrap our Chart.js graph, but because it's fairly easy to isolate we'll initialise it seperately and communicate with it bu using some method that we'll set up on the react `App`.

First, let's create a container in `index.html`, underneath out content div:

```html
<div id="content"></div>

<div id="results">
  <canvas id="answerChart" width="300" height="200"></canvas>
</div>
```

In an ideal world we'd place our chart inside the room component, but unfortunately Chart.js seems to have a bug whereby if you put it in a container that initially has no height, it gets stuck as being 0 high. Not very useful. Putting our chart at the bottom doesn't make too much practical difference, because it's blank whenever it doesn't have data. Let's initialise it with no data now, by adding to the script block at the bottom of `index.html`:

```js
<script type="text/jsx">
var socket = io.connect();
var chartElement = document.getElementById("answerChart").getContext("2d");
var chartData = {
    labels: [],
    datasets: [
        {
            fillColor: "#666666",
            data: []
        }
    ]
};
```

Now let's add those methods to `ReactApp.js` - there are three things that we are going to need to be able to do to the chart.

The first thing we need to be able to do is add columns of data:

```js
chartAddColumns: function(answers) {
  for(var key in answers) {
    if (answers.hasOwnProperty(key)) {
      answerChart.addData([answers[key]], key);
    }
  }
},
```

The second thing is we need to be able to do is totally clear the chart (when e.g. switching rooms or changing a question):

```js
chartClear: function() {
  var oldData = answerChart.datasets[0].bars.length;
  var loop = 0;
  while (loop < oldData) {
    loop = loop + 1;
    answerChart.removeData();
  }
},
```

We have to do a loop because the `removeData` method only removes the leftmost column.

Finally, we want to be able to dynamically update existing columns of data when a vote is placed:

```js
chartUpdate: function(answers) {
  answerChart.datasets[0].bars.forEach(function(element) {
    if (answers.hasOwnProperty(element.label) && (answers[element.label] != element.value)) {
      element.value = answers[element.label];
      answerChart.update();
    }
  });
},
```

Now our methods are set up, we can call them at the appropriate times.

`join room` in `componentDidMount`:
```js
if (roomData.answers) {
  reactApp.chartAddColumns(roomData.answers);
}
```

`set question` in `componentDidMount`:
```js
reactApp.chartClear();
reactApp.chartAddColumns(answers);
```

`vote` in `componentDidMount`:
```js
reactApp.chartUpdate(roomData.answers);
```

`returnToLobby` in `App`:
```js
this.chartClear();
```

That's it!

## Ways in which we could expand our application

### Features we could add

Here are some ideas for ways in which you could expand the application. Some of these are quite easy and others would require a bit more planning:

* Mark a room as inactive when the owner disconnects - tell the users of that room it has gone down
* Make it so that more than two possible answers can be added
* Store a cookie or some data in localStorage so the user gets a warning if they try and vote more than once (this is to prevent accidental voting, it's not going to be secure)
* Add some actual error messages when a user tries to do things like add a question when they haven't yet supplied any answer options

### How we'd build this in real life

This is definitely a demo application - what would we have to do to make it properly useable?

#### Serving it properly

The main thing, of course, is that we are currently just serving the application locally on port 3000. For a 'real' site, we'd want some proper hosting space, plus we'd want to be serving on port 80. Node.js is not appropriate for serving on this low level secure port, for security reasons. So what we should do instead is use a websever like Apache to do port forwarding from port 3000 to 80.

#### Using a database, garbage collection

Rather that keeping all of our room data in an array, we'd want to write out to a proper database. A lightweight noSql database like MongoDB or similar might work well for this simple structure. Storing our data in a database would enable us to do fancier things like owners reconnecting to rooms after they've disconnected (in conjunction with some authentication, of course) but this might not be desirable.

What *would* be desirable would be a periodic tidyup of old inactive rooms, otherwise the data will just grow and grow.

#### Making the JS production ready

We should consider adding some unit tests to ensure that our application behaves as we want it to, especially as we add or alter features.

We should switch from using the react client side JSX transformer to a build process instead, using either the react command line tools, or another build management tool like gulp. We should also minify and concatenate all of our client side JS files.

## Caveats

React is a fast moving framework and this was my first time using it - what's here works, but it may not continue to do so as react changes. As it is a young framework "best practice" is still a bit nebulous, not everything depicted here is necessarily the "best" way of achieving a thing.

# javascript-masterclass

## Summer of Tech bootcamp

During the masterclass we're going to be working on building a small application using Node, Express, Sockets.io, React and Chart.js

You will need to have at least a basic level of JavaScript in order to be able to participate - if you're not sure if you do, then work through [this tutorial](https://developer.mozilla.org/en-US/Learn/Getting_started_with_the_web/JavaScript_basics) to get up to speed first.

## Before the masterclass

If you'd like to follow along during the masterclass, there are a few things you'll need to set up in advance.

### Clone this repository

If you have your own github account already, you might prefer to fork this repository and clone that instead. If you don't just run the following commands on a terminal or command line interface:

    git clone https://github.com/jenofdoom/javascript-masterclass.git
    cd javascript-masterclass

If you don't already have git installed on your machine, the above won't work: you can either [install git](https://git-scm.com/downloads) or just grab the zip file of this project and unzip it.

### Install node, npm and bower

First, we need to install [node.js](https://nodejs.org/) and its package manager, npm.

[Windows instructions](http://blog.teamtreehouse.com/install-node-js-npm-windows)

[Mac instructions](http://blog.teamtreehouse.com/install-node-js-npm-mac)

[Ubuntu/Debian/Mint instructions](https://rtcamp.com/tutorials/nodejs/node-js-npm-install-ubuntu/)

Once that's done, we can install [Bower](http://bower.io/) using npm. We want to install Bower globally (for more than just this project), so we use a `-g` flag. Note that if you have difficulty installing Bower it might be because you need to install it with administrator permissions - rerun the command with `sudo` in front.

    npm install -g bower

### Install our dependencies

Now we've got npm and bower set up, we can use the `package.json` and `bower.json` files that are already set up in the project to install all the other packages we are going to be using. Have a look at those two files to see what things we are grabbing.

Run the following two commands (from inside the `javascript-masterclass` directory):

    npm install
    bower install

And you're all set! We'll pick up from this point.

## Building the application

We're going to build a classroom voting application. We'll be using JavaScript both on the server side (node, express, socket.io) and on the client side (react, Chart.js, and the socket.io client side library).

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
var socket = io();

React.render(
  etc...
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
etc...
```

We also need to make it so that while the application is running, users that are in the same room have a way of communicating without sending signals to users that *aren't* in the room. Add the following line above the console.log in the new room function:

```js
socket.join(hash);
```

### Displaying the new room

### Letting others join the room

#### via lobby

#### via url

### Setting a question and answers

#### Re-setting it

### Going back to the lobby

### Handling the room owner disconnecting (nice to have?)

### Letting people vote

### Displaying the vote results

## Ways in which we could expand our application

### How we'd build this in real life

#### Serving it properly

#### Using a database, garbage collection

### Features we could add

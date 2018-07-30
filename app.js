var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

var grids = require("./grids");

app.use(express.static("public"));

// ======
// globals
// ======

// an array of all users
var users = [];
// users by room
var rooms = {};
// grid by room
var active_grids = {};

// =========
// functions
// =========

// random integer choice from 0:N-1
function getRandomChoice(N) {
    return Math.floor(Math.random() * N);
}

// remove a user from an array
function removeUser(username, array) {
    var index = array.indexOf(username);
    // if we found a use remove them
    if (index > -1) {
        array.splice(index, 1);
    }
}

// is a username available?
function isUsernameAvailable(username) {
    var index = users.indexOf(username);
    if (index > -1) {
        return false
    } else {
        return true
    }
}

// get a random grid
function randomGrid() {
    return grids[getRandomChoice(grids.length)]
}

// home route
app.get("/", function (req, res) {
    res.render("home.ejs");
});

// ======================
// socket real time magic
// ======================

io.on('connection', function (socket) {
    console.log("A user connected.");

    // locals
    var username;
    var room;

    // disconnect
    socket.on("disconnect", function () {
        if (username !== undefined && room !== undefined) {
            exit();
        }
    });

    // leaveroom event
    socket.on('leaveroom', function () {
        exit();
    });

    // exit room
    function exit() {
        removeUser(username, users);
        removeUser(username, rooms[room]);
        socket.to(room).emit('updateonline', rooms[room]);
        socket.leave(room);
        if (rooms[room].length === 0) {
            delete rooms[room];
            delete active_grids[room];
        }
        username = undefined;
        room = undefined;
    }

    // requestuser event
    socket.on('requestuser', function (args) {
        var requested_username = args[0];
        var requested_room = args[1];
        console.log("A user requested sign up: " + requested_username);
        if (!isUsernameAvailable(requested_username)) {
            console.log('Username taken.');
            socket.emit('usernametaken');
            return;
        }
        username = requested_username;
        room = requested_room;
        users.push(username);
        if (rooms[room] === undefined) {
            rooms[room] = [username];
            active_grids[room] = randomGrid();
        } else {
            rooms[room].push(username)
        }
        socket.join(room);
        socket.emit('acceptuser', [username, room]);
        io.in(room).emit('updateonline', rooms[room]);
        socket.emit('deploygrid', active_grids[room])
    });

    // changegrid event
    socket.on('changegrid', function () {
        active_grids[room] = randomGrid();
        io.in(room).emit('deploygrid', active_grids[room]);
    });

    // assign roles event
    socket.on("assignroles", function () {
        var chameleonIndex = getRandomChoice(rooms[room].length);
        var chameleonName = rooms[room][chameleonIndex];
        var wordIndex = getRandomChoice(active_grids[room].length);
        var word = active_grids[room][wordIndex];
        io.in(room).emit("giveassigment", [word, chameleonName]);
    })

});

// listen
const port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log("Listening on port " + port);
});




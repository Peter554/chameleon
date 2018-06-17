var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

// ======
// globals
// ======

var grids = fetchGrids();
const NUMBER_OF_GRIDS = grids.length;
var active_grid = grids[randomChoice(NUMBER_OF_GRIDS)];
var users = [];

// =========
// functions
// =========

function randomChoice(N) {
    return Math.floor(Math.random() * N);
}

function removeUser(username) {
    var index = users.indexOf(username);
    if (index > -1) {
        users.splice(index, 1);
    }
}

// =============
// bits and bobs
// =============

// serve up public
app.use(express.static("public"));

// get the port
const port = process.env.PORT || 3000;

// home route
app.get("/", function(req, res) {
    res.render("home.ejs");
});

// ======================
// socket real time magic
// ======================

io.on('connection', function(socket) {
    console.log("A user connected.")
    socket.emit('deploygrid', active_grid)

    var this_user;

    // disconnect method
    socket.on('disconnect', function() {
        console.log("A user disconnected");
        removeUser(this_user);
        io.emit("updateonline", users)
    })

    // adduser event
    socket.on("requestuser", function(username) {
        this_user = username;
        users.push(username)
        io.emit("acceptuser")
        io.emit("updateonline", users)
    })

    // reset event
    socket.on('reset', function() {
        active_grid = grids[randomChoice(NUMBER_OF_GRIDS)];
        io.emit('deploygrid', active_grid)
    })

    // assign roles event
    socket.on("assign", function() {
        var chameleonIndex = randomChoice(users.length);
        var chameleonName = users[chameleonIndex];
        var wordIndex = randomChoice(active_grid.length);
        var word = active_grid[wordIndex];
        io.emit("giveassigment", [word, chameleonName]);
    })
});

// ======
// listen
// ======

server.listen(port, function() {
    console.log("Serving on port " + port);
});

// =====
// grids
// =====

function fetchGrids() {
    // don't miss commas between subarrays!
    return [
        // colors
        [
            "red",
            "blue",
            "green",
            "yellow",
            "black",
            "white",
            "orange",
            "pink",
            "brown",
            "purple",
            "gray",
            "gold",
            "silver",
            "bronze",
            "rainbow",
            "cream",
            "turquoise",
            "lilac"
        ],
        // food
        [
            "curry",
            "chips",
            "salad",
            "fish",
            "chicken",
            "sausage",
            "orange",
            "mango",
            "leek",
            "tomato",
            "pepper",
            "chilli",
            "beef",
            "pizza",
            "pasta",
            "ice cream",
            "chocolate",
            "strawberries"
        ]
    ]
}

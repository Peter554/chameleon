var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

// ======
// globals
// ======

var grids = fetchGrids();
const NUMBER_OF_GRIDS = grids.length;
var activeGrid = grids[randomChoice(NUMBER_OF_GRIDS)];
var users = [];

// =========
// functions
// =========

// random integer choice from 0:N-1
function randomChoice(N) {
    return Math.floor(Math.random() * N);
}

// remove a user from the users list
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
    socket.emit('deploygrid', activeGrid)

    var thisUser;

    // disconnect method
    socket.on('disconnect', function() {
        console.log("A user disconnected");
        removeUser(thisUser);
        io.emit("updateonline", users)
    })

    // adduser event
    socket.on("requestuser", function(username) {
        thisUser = username;
        var index = users.indexOf(username);
        if (index > -1) {
            socket.emit("usertaken")
            return;
        }
        users.push(username)
        socket.emit("acceptuser")
        io.emit("updateonline", users)
    })

    // reset event
    socket.on('reset', function() {
        activeGrid = grids[randomChoice(NUMBER_OF_GRIDS)];
        io.emit('deploygrid', activeGrid)
    })

    // assign roles event
    socket.on("assign", function() {
        var chameleonIndex = randomChoice(users.length);
        var chameleonName = users[chameleonIndex];
        var wordIndex = randomChoice(activeGrid.length);
        var word = activeGrid[wordIndex];
        io.emit("giveassigment", [word, chameleonName]);
    })

    // boot all event
    socket.on("bootallusers", function() {
        users = [];
        io.emit("resetuser")
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
            "Red",
            "Blue",
            "Green",
            "Yellow",
            "Black",
            "White",
            "Orange",
            "Pink",
            "Brown",
            "Purple",
            "Gray",
            "Gold",
            "Silver",
            "Bronze",
            "Rainbow",
            "Cream",
            "Turquoise",
            "Lilac"
        ],
        // food
        [
            "Curry",
            "Chips",
            "Salad",
            "Fish",
            "Chicken",
            "Sausage",
            "Orange",
            "Mango",
            "Leek",
            "Tomato",
            "Pepper",
            "Chilli",
            "Beef",
            "Pizza",
            "Pasta",
            "Ice cream",
            "Chocolate",
            "Strawberries"
        ],
        // capitals
        [
            "London",
            "Moscow",
            "Paris",
            "Berlin",
            "Madrid",
            "Rome",
            "Cairo",
            "Helsinki",
            "Stockholm",
            "Oslo",
            "Washington",
            "Mexico city",
            "Bejing",
            "Tokyo",
            "Seoul",
            "Vienna",
            "Nairobi",
            "Marrakesh"
        ],
        // rooms
        [
            "Hallway",
            "Kitchen",
            "Dining room",
            "Sitting room",
            "Bathroom",
            "Bedroom",
            "Cellar",
            "Attic",
            "Dungeon",
            "Conservatory",
            "Shed",
            "Study",
            "Garage",
            "Music room",
            "Workshop",
            "Greenhouse",
            "Gym",
            "Studio"
        ],
        // pets
        [
            "Dog",
            "Cat",
            "Parrot",
            "Rabbit",
            "Hamster",
            "Guinea pig",
            "Goldfish",
            "Snake",
            "Lizard",
            "Horse",
            "Alpaca",
            "Frog",
            "Rat",
            "Crab",
            "Budgie",
            "Spider",
            "Donkey",
            "Owl"
        ],
        // harry potter
        [
            "Harry Potter",
            "Ron Weasley",
            "Hermione Granger",
            "Neville Longbottom",
            "Luna Lovegood",
            "Albus Dumbledore",
            "Minerva Mcgonnagal",
            "Pomona Sprout",
            "Severus Snape",
            "Filius Flitwick",
            "Sirius Black",
            "Remus Lupin",
            "Peter Pettigrew",
            "Lord Voldemort",
            "Draco Malfoy",
            "Rubeus Hagrid",
            "Dobby",
            "Argus Filch"
        ],
        // marvel heros
        [
            "Spiderman",
            "Ironman",
            "Hulk",
            "Captain America",
            "Thor",
            "Deadpool",
            "Wolverine",
            "Groot",
            "Loki",
            "Star-lord",
            "Gamora",
            "Drax",
            "Magneto",
            "Jessica Jones",
            "Daredevil",
            "Charles Xavier",
            "Ant man",
            "Luke Cage"
        ]
    ]
}

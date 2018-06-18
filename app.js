var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

// ======
// globals
// ======

var grids = fetchGrids();
const NUMBER_OF_GRIDS = grids.length;
var users = [];
var rooms = {};
var active_grids = {};

// =========
// functions
// =========

// random integer choice from 0:N-1
function randomChoice(N) {
  return Math.floor(Math.random() * N);
}

// remove a user from an array
function removeUser(username, array) {
  var index = array.indexOf(username);
  if (index > -1) {
    array.splice(index, 1);
  }
}

// is a username available?
function availableUser(username) {
  var index = users.indexOf(username)
  if (index > -1) {
    return false
  } else {
    return true
  }
}

// get a random grid
function randomGrid() {
  return grids[randomChoice(grids.length)]
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
  console.log("\nA user connected.")

  // locals
  var username;
  var room;

  // disconnect
  socket.on("disconnect", function() {
    if (username != undefined && room != undefined) {
      exit();
    }
  })

  // leaveroom event
  socket.on('leaveroom', function() {
    exit();
  })

  // exit room
  function exit() {
    removeUser(username, users)
    removeUser(username, rooms[room])
    socket.to(room).emit('updateonline', rooms[room])
    socket.leave(room)
    if (rooms[room].length == 0) {
      delete rooms[room];
      delete active_grids[room];
    }
    console.log('\n' + username + ' requested to leave room ' + room)
    console.log(users)
    console.log(rooms)
    username = undefined;
    room = undefined;
  }

  // requestuser
  socket.on('requestuser', function(args) {
    var requested_username = args[0];
    var requested_room = args[1];
    console.log("\nA user requested sign up: " + requested_username)
    if (!availableUser(requested_username)) {
      console.log('Username taken.')
      socket.emit('usernametaken')
      return;
    }
    username = requested_username;
    room = requested_room;
    users.push(username);
    if (rooms[room] == undefined) {
      rooms[room] = [username]
      active_grids[room] = randomGrid();
    } else {
      rooms[room].push(username)
    }
    console.log(users)
    console.log(rooms)
    socket.join(room);
    socket.emit('acceptuser', [username, room])
    io.in(room).emit('updateonline', rooms[room])
    socket.emit('deploygrid', active_grids[room])
  })

  // changegrid
  socket.on('changegrid', function() {
    active_grids[room] = randomGrid();
    io.in(room).emit('deploygrid', active_grids[room]);
  })

  // assign roles event
  socket.on("assignroles", function() {
    var chameleonIndex = randomChoice(rooms[room].length);
    var chameleonName = rooms[room][chameleonIndex];
    var wordIndex = randomChoice(active_grids[room].length);
    var word = active_grids[room][wordIndex];
    io.in(room).emit("giveassigment", [word, chameleonName]);
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
    ],
    // disney
    [
      "Cinderella",
      "Belle",
      "Snow White",
      "Ariel",
      "Mulan",
      "Jasmine",
      "Pocahontas",
      "Mickey Mouse",
      "Donald Duck",
      "Pluto",
      "Bambi",
      "Peter Pan",
      "Captain Hook",
      "Baloo",
      "Winnie the Pooh",
      "Aladdin",
      "Hercules",
      "Tarzan"
    ],
    // sea cratures
    [
      "Starfish",
      "Shark",
      "Whale",
      "Dolphin",
      "Cod",
      "Jellyfish",
      "Seahorse",
      "Puffer fish",
      "Orka",
      "Coral",
      "Oysters",
      "Mussels",
      "Octopus",
      "Kraken",
      "Turtle",
      "Seal",
      "Sea cucumber",
      "Sting ray"
    ],
    // sports
    [
      "Football",
      "Rugby",
      "Athletics",
      "Swimming",
      "Hockey",
      "Tennis",
      "Badminton",
      "Golf",
      "Squash",
      "Gymnastics",
      "Trampolining",
      "Cycling",
      "Volleyball",
      "Cricket",
      "Baseball",
      "Basketball",
      "Skiing",
      "Sailing"
    ],
    // hobbies
    [
      "Stamps",
      "Trains",
      "Model Making",
      "Knitting",
      "Fishing",
      "Reading",
      "Painting",
      "Gardening",
      "Sailing",
      "Travel",
      "Walking",
      "Pottery",
      "Cooking",
      "Yoga",
      "Photography",
      "Hiking",
      "Bird watching",
      "Singing"
    ],
    // school
    [
      "Maths",
      "Chemistry",
      "Physics",
      "Biology",
      "History",
      "Philosophy",
      "Geography",
      "English",
      "Economics",
      "French",
      "Art",
      "Music",
      "Physical education",
      "Latin",
      "Religious studies",
      "Technology",
      "Geology",
      "Drama"
    ],
    // transport
    [
      "Plane",
      "Car",
      "Tank",
      "Helicopter",
      "Cruise ship",
      "Hovercraft",
      "Motorbike",
      "Bus",
      "Segway",
      "Cable car",
      "Jet ski",
      "Hot air balloon",
      "Train",
      "Spaceship",
      "Magic carpet",
      "Broomstick",
      "Cycle",
      "Skateboard"
    ],
    // jobs
    [
      "Fisherman",
      "Lumberjack",
      "Nurse",
      "Waiter",
      "Lighthouse keeper",
      "Secretary",
      "Accountant",
      "Teacher",
      "Lorry driver",
      "Security guard",
      "Chef",
      "Architect",
      "Police officer",
      "Lawyer",
      "Carpenter",
      "Butcher",
      "Doctor",
      "Film director"
    ]
  ]
}

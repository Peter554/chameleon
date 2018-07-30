var socket = io(); // important line!

// ==============
// client globals
// ==============

var username;
var room;

// reset
reset();

// ===========
// user signup
// ===========

// request user and room
$("#join").click(function () {
    var requested_username = $('#login-name').val();
    var requested_room = $('#login-room').val();
    if (isEmpty(requested_username) || isEmpty(requested_room)) {
        warnEmpty();
        return;
    }
    socket.emit('requestuser', [requested_username, requested_room]);
});

// accept user
socket.on("acceptuser", function (args) {
    username = args[0];
    room = args[1];
    $('#login-div').hide();
    $('#game-div').show();
    $('#room-indicator').html('<strong>You are in room: ' + room + '</strong>');
});

// username taken
socket.on('usernametaken', function () {
    warnUsernameTaken();
});

// update whos online
socket.on('updateonline', function (users) {
    showUsers(users)
});

// leave room
$('#leave').click(function () {
    socket.emit('leaveroom');
    reset();
});

// ====
// grid
// ====

// change the grid
$('#change-grid').click(function () {
    socket.emit('changegrid')
});

// deploy grid
socket.on('deploygrid', function (grid) {
    grid = shuffleArray(grid);
    for (var i = 0; i < grid.length; i++) {
        $('.grid-item').eq(i).html(grid[i]);
    }
    $("#role").html("Role unassigned");
    $("#role").show();
});

// =====
// roles
// =====

// assign roles
$('#assign-roles').click(function () {
    socket.emit("assignroles");
});

// show assignment
socket.on("giveassigment", function (args) {
    var word = args[0];
    var chameleonName = args[1];
    if (username === chameleonName) {
        $("#role").html("You are the Chameleon!");
    } else {
        $("#role").html("The word is: " + word);
    }
    $("#role").show();
});

// hide role
$("#hide-role").click(function () {
    $("#role").toggle();
});


// =========
// functions
// =========

function reset() {
    username = undefined;
    room = undefined;
    $('#login-div').show();
    $('#warn').hide();
    $('#game-div').hide();
}

function isEmpty(string) {
    if (string.length === 0) {
        return true;
    } else {
        return false;
    }
}

function warnEmpty() {
    $("#warn").show();
    $("#warn").html("Empty username or room key");
}

function warnUsernameTaken() {
    $("#warn").show();
    $("#warn").html("Username taken");
}

function showUsers(users) {
    $('#user-indicator').html('<strong>Users in this room now:</strong> ');
    users.forEach(function (user, index) {
        $('#user-indicator').append(user);
        if (index < users.length - 1) {
            $('#user-indicator').append(", ")
        }
    })
}

function shuffleArray(array) {
    var newArray = [];
    var initial_length = array.length;
    for (var i = 0; i < initial_length; i++) {
        var index = getRandomChoice(array.length);
        newArray.push(array[index]);
        array.splice(index, 1);
    }
    return newArray;
}

function getRandomChoice(N) {
    return Math.floor(Math.random() * N);
}

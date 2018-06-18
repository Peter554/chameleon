// Note: Logging is client side!!

// important line!!!
var socket = io();

// ==============
// client globals
// ==============

var username;
var room;

// reset
reset();

// ======
// socket
// ======

// request user and room
$("#join").click(function() {
    var requested_username = $('#login-name').val();
    var requested_room = $('#login-room').val();
    if (isEmpty(requested_username) || isEmpty(requested_room)) {
        warnEmpty();
        return;
    }
    socket.emit('requestuser', [requested_username, requested_room]);
})

// accept user
socket.on("acceptuser", function(args) {
    username = args[0];
    room = args[1];
    console.log(room)
    $('#login-div').hide();
    $('#game-div').show();
    $('#room-indicator').html('<strong>You are in room: ' + room + '</strong>');
})

// username username
socket.on('usernametaken', function(){
    $("#warn").show();
    $("#warn").html("Username taken")
})

// update whos online
socket.on('updateonline', function(users){
    showUsers(users)
})

// leave room
$('#leave').click(function() {
    socket.emit('leaveroom')
    reset();
})

// change the grid
$('#change-grid').click(function() {
    console.log("A user clicked change grid in room " + room)
    socket.emit('changegrid')
})

// assign roles
$('#assign-roles').click(function() {
    console.log("A user clicked assign roles in room " + room)
    socket.emit("assignroles")
    $("#role").show();
})

// hide role
$("#hide-role").click(function() {
    $("#role").toggle();
})

// deploy grid
socket.on('deploygrid', function(grid) {
    grid = shuffleArray(grid);
    for (var i = 0; i < grid.length; i++) {
        $('.grid-item').eq(i).html(grid[i]);
    }
    $("#role").html("Role unassigned");
    $("#role").show();
})

// show assignment
socket.on("giveassigment", function(args) {
    var word = args[0];
    var chameleonName = args[1];
    if (username == chameleonName) {
        $("#role").html("You are the Chameleon!");
    } else {
        $("#role").html("The word is: " + word);
    }
})


// =========
// functions
// =========

function reset(){
    username = undefined;
    room = undefined;
    $('#login-div').show();
    $('#warn').hide();
    $('#game-div').hide();
}

function isEmpty(string){
    if (string.length == 0){
        return true;
    } else {
        return false;
    }
}

function warnEmpty(){
    $("#warn").show();
    $("#warn").html("Empty username or room key")
}

function showUsers(users){
    $('#user-indicator').html('<strong>Users in this room now:</strong> ');
    var i = 0;
    users.forEach(function(user) {
        $('#user-indicator').append(user)
        i = i + 1;
        if (i < users.length) {
            $('#user-indicator').append(", ")
        }
})
}

// shuffle array
function shuffleArray(array) {
    var newArray = [];
    var initial_length = array.length;
    for (var i = 0; i < initial_length; i++) {
        var index = randomChoice(array.length)
        newArray.push(array[index])
        array.splice(index, 1);
    }
    return newArray
}


// random integer choice from 0:N-1
function randomChoice(N) {
    return Math.floor(Math.random() * N);
}

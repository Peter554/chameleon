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

// =========
// functions
// =========

function reset(){
    username = '';
    room = '';
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

// Note: Logging is client side!!

// important line!!!
var socket = io();

// client side username
var username;

$("#game").hide();

// sign up
$("#join").click(function() {
    username = $('#username').val();
    console.log(username);
    if (username.length == 0) {
        console.log("Empty username detected")
        return
    }
    socket.emit('adduser', username);
})

// accept user
socket.on("acceptuser", function() {
    $('#signup').hide();
    $('#game').show();
})

// reset the grid
$('#reset').click(function() {
    console.log("A user clicked reset")
    socket.emit('reset')
})

// assign roles
$('#assign').click(function() {
    console.log("A user clicked assign")
    socket.emit("assign")
})

// deploy a grid
socket.on('deploygrid', function(grid) {
    for (var i = 0; i < 12; i++) {
        $('.grid-item').eq(i).html(firstLetterUpper(grid[i]));
    }
})

// update whos online
socket.on('updateonline', function(users) {
    $('#onlinenow').html('<strong>Users online now:</strong> ');
    var i = 0;
    users.forEach(function(user) {
        $('#onlinenow').append(user)
        i = i + 1;
        if (i < users.length) {
            $('#onlinenow').append(", ")
        }
    })
})

// show assignment
socket.on("giveassigment", function(args){
    var word = args[0];
    var camelyonName = args[1];
    console.log("The word is " + word);
    console.log("The Camelyon is " + camelyonName);
    if (username == camelyonName) {
        $("#role").html("You are the Camelon!");
    } else {
        $("#role").html("The word is: " + word);
    }
})

$("#hide-sensitive").click(function(){
    $(".sensitive").toggle();
})

// first letter to upper case
function firstLetterUpper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

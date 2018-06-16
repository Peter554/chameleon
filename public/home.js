// Note: Logging is client side!!

// important line!!!
var socket = io();

// client side username
var username;

// hide the game at the start - should give a username first
$("#game").hide();

// sign up
$("#join").click(function() {
    username = $('#username').val();
    console.log(username);
    if (username.length == 0) {
        console.log("Empty username detected")
        return
    }
    socket.emit('requestuser', username);
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
    grid = shuffleArray(grid);
    for (var i = 0; i < grid.length; i++) {
        $('.grid-item').eq(i).html(firstLetterUpper(grid[i]));
    }
    $("#role").html("Role unassigned");
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
socket.on("giveassigment", function(args) {
    var word = args[0];
    var camelyonName = args[1];
    console.log("The word is " + word);
    console.log("The Camelyon is " + camelyonName);
    if (username == camelyonName) {
        $("#role").html("You are the Camelon!");
    } else {
        $("#role").html("The word is: " + firstLetterUpper(word));
    }
})

// toggle the sensitive data - the role
$("#hide-sensitive").click(function() {
    $("#role").toggle();
})

// first letter to upper case
function firstLetterUpper(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// shuffle array
function shuffleArray(array) {
    var new_array = [];
    var initial_length = array.length;
    for (var i = 0; i < initial_length; i++) {
        var index = randomChoice(array.length)
        new_array.push(array[index])
        array.splice(index, 1);
    }
    return new_array
}

// random integer choice from 0:N-1
function randomChoice(N) {
    return Math.floor(Math.random() * N);
}

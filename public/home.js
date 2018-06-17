// Note: Logging is client side!!

// important line!!!
var socket = io();

// client side username
var username;

// hide the warning bar at the start
$("#warn").hide();

// hide the game at the start - should give a username first
$("#game").hide();

// request user
$("#join").click(function() {
    username = $('#username').val();
    console.log(username);
    if (username.length == 0) {
        console.log("Empty username detected");
        $("#warn").show();
        $("#warn").html("Empty username")
        return;
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
    $("#role").show();
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
    var chameleonName = args[1];
    if (username == chameleonName) {
        $("#role").html("You are the Chameleon!");
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

// user taken event
socket.on("usertaken", function(){
    $("#warn").show();
    $("#warn").html("Username taken")
})

// boot all users
$("#bootall").click(function(){
    socket.emit("bootallusers");
})

// reset user event
socket.on("resetuser", function(){
    $("#signup").show();
    $("#warn").hide();
    $("#game").hide();
})

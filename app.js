var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

// serve up public
app.use(express.static("public"));

// get the port
const port = process.env.PORT || 3000;

// home route
app.get("/", function(req, res){
    res.render("home.ejs");
});

// listen
server.listen(port, function(){
    console.log("Serving on port " + port);
});

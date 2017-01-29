/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var path = require('path');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
var http = require('http').Server(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


// api path
var search = require('./routes/search');
app.use('/search', search);

var viewer = require('./routes/viewer');
app.use('/viewer', viewer);

var testData = [
  {"lbl":"hoge1","val":[30,40]},
  {"lbl":"hoge2","val":[120,115]},
  {"lbl":"hoge3","val":[125,90]},
  {"lbl":"hoge4","val":[150,160]},
  {"lbl":"hoge5","val":[300,190]},
  {"lbl":"hoge6","val":[60,40]},
  {"lbl":"hoge7","val":[140,145]},
  {"lbl":"hoge8","val":[165,110]},
  {"lbl":"hoge9","val":[200,170]},
  {"lbl":"hoge0","val":[240,200]}
];
//socket
var io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected');
  setInterval(function(){
  var result = testData.map(function(d){
    //random create
    var x = Math.random() * 300;
    var y = Math.random() * 200;
    return {"lbl":d.lbl,"val":[x, y]}
  });
    socket.emit("update val",result);
  },2000);
});

// start server on the specified port and binding host
http.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

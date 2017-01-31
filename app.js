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
//amqp
var amqp = require('amqplib/callback_api');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var url = require('url');
var rabbit = 'amqps://admin:UHBNFRYPESQJNNEG@bluemix-sandbox-dal-9-portal.0.dblayer.com:22646/bmix_dal_yp_c006c6d6_a709_477e_9b4c_e02e6579032f';
parse_url = url.parse(rabbit);
amqp.connect(rabbit,{ servername:parse_url.hostname },function(err,conn){
  if(err) throw err;
  conn.createChannel(function(err,ch){
    var q = 'hello';
    ch.assertQueue(q,{durable: false});
 //   setInterval(function(){
 //     ch.sendToQueue(q, new Buffer("OK?"));
 //     console.log("send?");
 //   },5000);
  });
});

var current_data = [];

var io = require('socket.io')(http);
amqp.connect(rabbit,{servername:parse_url.hostname }, function(err,conn){
  if(err) throw err;
  conn.createChannel(function(err,ch){
    var q = 'hello';
    ch.assertQueue(q,{durable: false});
    ch.consume(q, function(msg){
//      console.dir(msg.content.toString());
//      console.log('receive:   ' + msg.content.toString());
//    current_data = testData.map(function(d){
//      //random create
//      var x = Math.random() * 600;
//      var y = Math.random() * 500;
//      return {"lbl":d.lbl,"val":[x, y]}
//    });
//    msg_json = JSON.parse(msg.content.toString());
//    current_data = [];
//    console.dir(current_data);
//    console.log('receive');
//    console.log(JSON.parse(msg.content.toString()));
      current_data  = JSON.parse(msg.content.toString());
    },{noAck: true});
  });
});
//socket
io.on('connection', function(socket){
  console.log('a user connected');
  setInterval(function(){
    socket.emit("update val",current_data);
  },2000);
});

// start server on the specified port and binding host
http.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
}).on("error",function(e){
  console.dir(e);
});


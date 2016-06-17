var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
	console.log('user disconnected');
	});
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

// datadog-metrics
var metrics = require('datadog-metrics');
metrics.init({ host: 'myhost', prefix: 'socket.io_chat' });

function collectMemoryStats() {
 var memUsage = process.memoryUsage();
 metrics.gauge('memory.rss', memUsage.rss);
 metrics.gauge('memory.heapTotal', memUsage.heapTotal);
 metrics.gauge('memory.heapUsed', memUsage.heapUsed);
};

setInterval(collectMemoryStats, 5000);

http.listen(8080, function(){
	console.log('listening on *:8080');
});

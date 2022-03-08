var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

    console.log('Usuario conectado');

    socket.on('server:new_msg', function (msj) {
        io.emit('client:new_msg', msj);
    });

    socket.on('disconnect', function () {
        console.log('Usuario desconectado');
    });

});

http.listen(3000, function () {
    console.log('Server runing on port 3000');
});
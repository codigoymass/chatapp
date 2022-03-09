var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var {read, write} = require('./files');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/data', function(req, res) {
    res.send(read());
});

io.on('connection', function (socket) {

    console.log('Usuario conectado socket:' + socket.id); 

    socket.on('insert_user', (username) => {
        let data = read();
        data.users.push({
            id: socket.id,
            user: username
        });
        if(write(data))
            io.emit('list_users');
            io.emit('list_mensajes');
    });

    socket.on('insert_mensaje', function (id_user, user, mensaje) {
        let data = read();
        data.mensajes.push({
            id_user: id_user,
            username: user,
            mensaje: mensaje,
            hora: '04:30pm'
        });
        if(write(data))
            io.emit('list_mensajes', id_user);

    });

    socket.on('disconnect', function () {
        console.log('Usuario desconectado ' + socket.id);
        let data = read();
        let ids = data.users.map(item => item.id);

        let index = ids.indexOf(socket.id);
        data.users.splice(index, 1);

        if(write(data))
            io.emit('list_users');

    });

});

http.listen(3000, function () {
    console.log('Server runing on port 3000');
});
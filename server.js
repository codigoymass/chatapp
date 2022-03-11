var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors = require('cors');
var {read, write} = require('./files');

// app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors({origin: '*', optionsSuccessStatus: 200}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/data', function(req, res) {
    res.send(read());
});

io.on('connection', function (socket) {

    // VALIDACIÓN DEL LOGIN
    app.post('/login', (req, res) => {
        
        let data = read();
        if(data.users.includes(req.body.username)) {
            res.send(JSON.parse(true));
        } else {
            data.users.push(req.body.username);
            write(data);
            res.send(JSON.parse(false));
            io.emit('list_users');
        }
        
    });

    socket.on('insert_mensaje', function (user, mensaje) {
        let data = read();
        data.mensajes.push({
            username: user,
            mensaje: mensaje,
            hora: '04:30pm'
        });
        if(write(data))
            io.emit('list_mensajes');

    });

    socket.on('inicio_escribiendo', (username) => {
        io.emit('mostrar_escribiendo', username);
    });

    socket.on('logout', (username) => {
        let data = read();

        let index = data.users.indexOf(username);
        data.users.splice(index, 1);

        if(write(data))
            io.emit('list_users');
    });

    socket.on('disconnect', () => {
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
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const publicDir = {
    root: __dirname + '/public',
};

// Routes
app.get('/', (request, response) => {
    response.sendFile('index.html', publicDir);
});

// Listen on every connection
// Whenever someone connects this gets executed
io.on('connection', (socket) => {
    console.log('User connected');

    // Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function() {
        console.log('User disconnected');
    });

    // Listen on chat-message
    socket.on('chat-message', (data) => {
        io.sockets.emit('chat-message', data);
    });

    // Listen on typing-start
    socket.on('typing-start', (data) => {
        io.sockets.emit('typing-start');
    });

    // Listen on typing-end
    socket.on('typing-end', (data) => {
        io.sockets.emit('typing-end');
    });
});


http.listen(3000, () => {
    console.log('Server listening on http://localhost:3000')
});
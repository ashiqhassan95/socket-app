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
    // Get the chatID of the user and join in a room of the same chatID
    let sender = socket.handshake.query.sender;

    // socket.join(sender);

    console.log(sender + ' connected');

    // Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function() {
        console.log(sender + ' disconnected');
    });

    // Listen on chat-message
    socket.on('chat-message', (data) => {
        // Send message to all others except sender
        socket.broadcast.emit('chat-message', data);

        // Send message to only that particular room
        // socket.in(sender).emit('chat-message', data);
    });

    // Listen on typing-start
    socket.on('typing-start', (data) => {
        socket.broadcast.emit('typing-start', data);
    });

    // Listen on typing-end
    socket.on('typing-end', (data) => {
        socket.broadcast.emit('typing-end', data);
    });
});


http.listen(3000, () => {
    console.log('Server listening on http://localhost:3000')
});
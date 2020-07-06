const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');
const path = require('path');

const publicDir = {
    root: path.join(__dirname, 'public'),
};

// Routes
app.get('/', (request, response) => {
    response.sendFile('index.html', publicDir);
});

const rooms = [];

// Listen on every connection
// Whenever someone connects this gets executed
io.on('connection', (socket) => {
    // Get the chatID of the user and join in a room of the same chatID
    let sender = socket.handshake.query.sender;
    let recipient = socket.handshake.query.recipient;
    let session = '';

    let room = rooms.find(room => (room.sender === sender && room.recipient === recipient) || (room.recipient === sender && room.sender === recipient));

    if (room === undefined) {
        room = {
            sender: sender,
            recipient: recipient,
            address: moment().unix()
        };

        rooms.push(room);
    }

    console.log(rooms);

    // Assign sesstion to room address
    session = room.address;

    // Join sender 
    socket.join(session);

    // Notify sender that socket has connected to a session
    socket.emit('connected', room); 

    console.log(sender + ' connected to ' + session); 

    // Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function() {
        console.log(sender + ' disconnected and room ' + session + ' destroyed');
        socket.leave(session);
    });

    // Listen on chat-message
    socket.on('chat-message', (data) => {
        // Retrive session from incoming payload
        let session = data.address; 

        // Send message to all participant in the room except sender 
        socket.to(session).emit('chat-message', data);
 
    });

    // Listen on typing-start
    socket.on('typing-start', (data) => {
        // Retrive session from incoming payload
        let session = data.address;

        /// Notify to all participant in the room except sender 
        // that sender start typing
        socket.to(session).emit('typing-start', data);
    });

    // Listen on typing-end
    socket.on('typing-end', (data) => {
        // Retrive session from incoming payload
        let session = data.address;

        // Notify to all participant in the room except sender 
        // that sender stop typing
        socket.to(session).emit('typing-end', data);
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log('Server listening on http://localhost:' + port)
});
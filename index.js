// index.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// CORS configuration
const corsOptions = {
    origin: 'https://bank-client-pnb6.onrender.com', // your client's origin
    methods: 'GET,POST', // specify allowed methods
    credentials: true   // allow credentials
};

app.use(cors(corsOptions)); // Use CORS middleware
app.use(express.json()); // For parsing application/json

// Your API route
app.post('/create', (req, res) => {
    // Example of handling a POST request
    const data = req.body; // Assuming JSON data is sent
    console.log('Data received:', data);
    res.json({ message: 'Data received successfully!' });
});

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'https://bank-client-pnb6.onrender.com', // same origin policy for WebSocket
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Handling WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Handle events as needed
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

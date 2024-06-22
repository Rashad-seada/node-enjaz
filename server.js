const http = require('http');
const { WebSocketServer } = require('ws'); // Import WebSocket module
const app = require('./app');
const handleConnection = require('./ws-handler');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Array to store connected WebSocket clients

const wss = new WebSocketServer({ server });

wss.on('connection',handleConnection);


server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

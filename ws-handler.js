const clients = [];

function handleConnection(ws) {
    console.log("Client connected successfully");

    clients.push(ws);

    ws.on('message', (message) => {
        handleMessage(message)
    });
}

function handleMessage(message) {
    try {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'notification':
                handleNotification(data);
                break;
            case 'otherMessageType':
                handleOtherMessageType(data);
                break;
            default:
                handleUnknownMessage(data);
                break;
        }
    } catch (error) {
        console.error(`Error parsing WebSocket message: ${error}`);
    }
}

function handleNotification(data){
    broadcast(JSON.stringify(data));
}

function handleOtherMessageType(){
}

function handleUnknownMessage(){
}

function broadcast(message) {
    clients.forEach((client) => {
        client.send(message);
    });
}

module.exports = handleConnection;
let WS = require('ws');

let ws_server = new WS.Server({port: 4000, host: 'localhost'});
let messageCounter = 0;

ws_server.on('connection', (clientSocket) =>
{
    clientSocket.on('message', (data) =>
    {
        let clientMessage = JSON.parse(data);
        console.log('client message: ' + data);

        clientSocket.send(JSON.stringify({server: ++messageCounter,
                                                client: clientMessage.client,
                                                timestamp: clientMessage.timestamp}));
    });
});
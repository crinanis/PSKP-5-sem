let webSocket = require('ws');
const fs = require('fs');

const webServer = new webSocket.Server({port: 4000, host: 'localhost'});

let k = 1;

webServer.on('connection', (clientSocket) =>
{
    const webSocketStream = webSocket.createWebSocketStream(clientSocket, {encoding: 'utf-8'});
    const file = fs.createWriteStream(__dirname + `\\upload\\file_${k++}.txt`);
    webSocketStream.pipe(file);
});
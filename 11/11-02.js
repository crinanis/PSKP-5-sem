let webSocket = require('ws');
let fs = require('fs');

const webServer = new webSocket.Server({port: 4000, host: 'localhost'});

webServer.on('connection', (clientSocket) =>
{
    let webSocketStream = webSocket.createWebSocketStream(clientSocket, {encoding: 'utf-8'});
    let file = fs.createReadStream('./download/file.txt');
    file.pipe(webSocketStream);
});
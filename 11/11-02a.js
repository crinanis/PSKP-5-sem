const WebSocket = require('ws');
const fs = require('fs');

const webSocket = new WebSocket('ws://localhost:4000/');
const webSocketStream = WebSocket.createWebSocketStream(webSocket, {encoding: 'utf-8'});
const file = fs.createWriteStream('./FileFromServer.txt');

webSocketStream.pipe(file);
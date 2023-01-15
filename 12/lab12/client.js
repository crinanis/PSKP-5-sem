const websocket = require('ws');
const ws = new websocket('ws://localhost:4001/');

ws.on('message', (data) => {
    console.log(data);
});

ws.on('close', () => {
    console.log('Соединение закрыто');
});
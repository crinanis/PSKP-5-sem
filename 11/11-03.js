const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 4000, host: 'localhost'});

let n = 0;

wss.on('connection', (ws) =>
{
    wss.on('pong', (data) =>{
        console.log('on pong: ', data.toString());
    })

    wss.clients.forEach((client) =>
    {
        setInterval(() =>
        {
            client.send(`11-03-server: ${++n}\n`);
        }, 15000);
    });

    setInterval(() =>
    {
        console.log(`server: ping, ${wss.clients.size} connected clients`);
        ws.ping('server: ping');
    }, 5000);
});
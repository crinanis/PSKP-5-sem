let serverPort = 5000;
let serverHost = '127.0.0.1';

let dgram = require('dgram');
let message = 'Hello from client';

let client = dgram.createSocket('udp4');
let intervalRef = null;

intervalRef = setInterval(()=>
{
    client.send(message, 0, message.length, serverPort, serverHost,
    (err, bytes) => { if (err) throw err; });
}, 1000);

setTimeout(()=>
{
    clearInterval(intervalRef);
    client.close();
}, 20000);

client.on('message', (message, remote) =>
{
    console.log('Received data on client: ' + message.toString());
});
let serverPort = 5000;
let serverHost = '127.0.0.1';

let dgram = require('dgram');
let server = dgram.createSocket('udp4');

server.on('listening', () =>
{
    let address = server.address();
    console.log('UDP-Server ' + address.address + ":" + address.port);
});

server.on('message', (message, remote) =>
{
    console.log('Received data on server: ' + message.toString());
    var msgResponse="ECHO: " + message.toString();
    server.send(msgResponse, 0, msgResponse.length, remote.port, remote.address,
    (err, bytes) => { if (err) throw err; });
});

server.bind(serverPort, serverHost);
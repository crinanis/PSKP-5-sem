let net = require('net');

let serverHost = '127.0.0.1';
let serverPort = 5000;

let server = net.createServer();

server.on('connection', (clientSocket) =>
{
    console.log('new connection on server: ' + clientSocket.remoteAddress + ':' + clientSocket.remotePort);

    clientSocket.on('data', (data) =>
    {
        console.log('received data on server: ', data.toString());
        clientSocket.write('ECHO: ' + data);
    });

    clientSocket.on('close', () =>
    {
        console.log('connection was closed: ' + clientSocket.remoteAddress + ' ' + clientSocket.remotePort);
    });
});

server.on('listening', ()=>{console.log('TCP-server has started: '+serverHost+':'+serverPort);});
server.listen(serverPort, serverHost);
const net = require('net');

let serverHost = '127.0.0.1';
let serverPort = 5000;

let sum = 0;

let server = net.createServer((clientSocket)=>
{
    console.log('new connection on server: ' + clientSocket.remoteAddress + ':' + clientSocket.remotePort);

    clientSocket.on('data', (data)=>
    {
        console.log('Received number: ' + data.readInt32LE());
        sum+=data.readInt32LE();
    });

    let buf = Buffer.alloc(4);
    let intervalRef = setInterval(() =>
    {
        buf.writeInt32LE(sum, 0);
        clientSocket.write(buf);
    }, 5000);

    clientSocket.on('close', () =>
    {
        console.log('connection closed: '+ clientSocket.remoteAddress+' '+clientSocket.remotePort);
        clearInterval(intervalRef);
    });
});

server.on('listening', ()=>{console.log('TCP-server listening on: '+serverHost+':'+serverPort);});
server.listen(serverPort, serverHost);
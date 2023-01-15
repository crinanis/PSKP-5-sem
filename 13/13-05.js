const net = require('net');

let serverHost = '127.0.0.1';
let serverPort = 5000;

let server = net.createServer((clientSocket)=>
{
    let sum = 0;
    let clientSocketString = `${clientSocket.remoteAddress}:${clientSocket.remotePort}`;
    console.log('new connection on server: '+clientSocketString);

    clientSocket.on('data', (data)=>
    {
        console.log(`Received number from ${clientSocketString}: ` + data.readInt32LE());
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
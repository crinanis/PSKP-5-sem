const net = require('net');

let serverHost = '127.0.0.1';
let serverPort1 = 5000;
let serverPort2 = 5001;

let clientProcessing = (port) => { return (clientSocket) =>
{
    let clientSocketString = `${clientSocket.remoteAddress}:${clientSocket.remotePort}`;
    console.log('new connection on server: '+clientSocketString);

    clientSocket.on('data', (data)=>
    {
        console.log(`On port ${port} received number from ${clientSocketString}: ` + data.readInt32LE());
        clientSocket.write(`ECHO: ${data.readInt32LE()}`);
    });

    clientSocket.on('close', () =>
    {
        console.log(`connection closed on port ${port}: `+ clientSocket.remoteAddress+' '+clientSocket.remotePort);
    });
};}

net.createServer(clientProcessing(serverPort1)).listen(serverPort1, serverHost).on('listening', ()=>{console.log('TCP-server listening on: '+serverHost+':'+serverPort1);});
net.createServer(clientProcessing(serverPort2)).listen(serverPort2, serverHost).on('listening', ()=>{console.log('TCP-server listening on: '+serverHost+':'+serverPort2);});
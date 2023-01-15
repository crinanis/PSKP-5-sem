const net = require('net');

let server_host = '127.0.0.1';
let server_port = 5000;

let client = new net.Socket();
let intervalRef = null;

client.connect(server_port, server_host, () =>
{
    console.log('Success connection: '+client.remoteAddress + ':' + client.remotePort);

    intervalRef = setInterval(()=>{client.write('Hello from client')}, 1000);
    setTimeout(()=>
    {
        clearInterval(intervalRef);
        client.end();
    }, 10000);
});

client.on('data', (data)=>{console.log(data.toString());});

client.on('close', ()=>{console.log('Connection was closed');});
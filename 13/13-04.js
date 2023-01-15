const net = require('net');

let server_host = '127.0.0.1';
let server_port = 5000;

let client = new net.Socket();
let intervalRef = null;

let buf = Buffer.alloc(4);
let num = 0;

client.connect(server_port, server_host, () =>
{
    console.log('Success connection: '+client.remoteAddress + ':' + client.remotePort);

    intervalRef = setInterval(()=>
    {
        console.log('Client sending number: ' + num);
        client.write((buf.writeInt32LE(num++, 0), buf));
    }, 1000);
    setTimeout(()=>
    {
        clearInterval(intervalRef);
        client.end();
    }, 20000);
});

client.on('data', (data)=>{console.log('Received sum: ' + data.readInt32LE());});

client.on('close', ()=>{console.log('Connection was closed');});
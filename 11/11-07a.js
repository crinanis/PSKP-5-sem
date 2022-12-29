const readline = require('readline');
const rpcWSS = require('rpc-websockets').Client;

const ws = new rpcWSS('ws://localhost:4000');
ws.on('open', () =>
{
    console.log('Enter A, B or C to notify');
    var rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', function(line){ ws.notify(line); })
});
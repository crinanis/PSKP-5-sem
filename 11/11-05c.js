const rpcWSS = require('rpc-websockets').Client;

const ws = new rpcWSS('ws://localhost:4000/');
ws.on('open', () =>
{
    ws.login({login: '1234', password: '1234'})
        .then(async () =>
        {
            console.log('result:',
                await ws.call('sum', 
                [
                    await ws.call('square', [3]),
                    await ws.call('square', [5, 4]),
                    await ws.call('mul', [3, 5, 7, 9, 11, 13])
                ])
                + await ws.call('fibn', [7])
                * await ws.call('mul', [2, 4, 6])
            )
        });
});
ws.on('error', (e)=>{console.log('error = ', e)});
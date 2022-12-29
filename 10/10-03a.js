const WebSocket = require('ws');

let parm2 = process.argv[2];

console.log('client name = ', parm2);

let prfx = typeof parm2 == 'undefined'?'A':parm2;
const ws = new WebSocket('ws://localhost:5000/broadcast');

ws.on('open', ()=>
{
    let k = 0;
    setInterval(()=>
    {
        ws.send(`client: ${prfx}-${++k}`);
    }, 5000);

    ws.on('message', message =>
    {
        console.log(`${message}`)
    })

    //setTimeout(()=>{ws.close()}, 25000);
});
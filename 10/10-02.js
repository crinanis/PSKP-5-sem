const WebSocket = require('ws');

const webSocket = new WebSocket('ws://localhost:4000/wsserver');
let k=0;

webSocket.on('open',()=>
{
    console.log('webSocket: onopen dispatcher');
    let n = 1;
    let sendingInterval = setInterval(() => { webSocket.send(`10-02-client: ${n++}`);}, 3000);

    setTimeout(()=>
    {
        clearInterval(sendingInterval);
        webSocket.close();
    }, 25000);
})

webSocket.onmessage = (serverResponse) =>
{
    console.log(`${serverResponse.data}`);
};
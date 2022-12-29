let WS = require('ws');

let ws_client = new WS('ws://localhost:4000/');

ws_client.on('open', () =>
{
   setInterval(()=>
   {
       ws_client.send(JSON.stringify({client: process.argv[2], timestamp: new Date().toISOString()}));
   }, 5000);

   ws_client.on('message', (inMessage) =>
   {
       console.log('incoming message: ' + inMessage);
   });
});
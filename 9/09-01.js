let http = require('http');

let options = {
    host: 'localhost',
    path: '/',
    port: 5000,
    method: 'GET'
}
const req = http.request(options, (res)=>{
    console.log('response: ', res.statusCode);
    console.log('statusMessage: ', res.statusMessage);
    console.log('remotePort: ', res.socket.remotePort);

    let data ='';
    res.on('data', (chunk)=>{
        console.log('data: body: ', data += chunk.toString('utf-8'));
    });
    res.on('end', ()=>{console.log('end: body: ', data);});
});

req.on('error', (e)=>{console.log('error: ', e.message);});
req.end();
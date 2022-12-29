const http = require('http');
const fs = require('fs');

let options =
    {
        host: 'localhost',
        path: '/eight',
        port: 5000,
        method:'GET'
    }
const req = http.request(options,(res)=>
{
    res.pipe(fs.createWriteStream('file.png'));
});

req.end();
const http = require('http');
const fs = require('fs');

let bound = 'divider'
let body = `--${bound}\r\n`;
body += 'Content-Disposition:form-data; name="file"; Filename="MyFile.png"\r\n';
body += 'Content-Type:application/octet-stream\r\n\r\n';

let options =
        {
        host: 'localhost',
        path: `/sixth_seventh`,
        port: 5000,
        method:'POST',
        headers: {'Content-Type':`multipart/form-data; boundary=${bound}`}
        }

const req = http.request(options, (res)=>{
        console.log('method: ', req.method);
        console.log('response: ', res.statusCode);
        console.log('statusMessage: ', res.statusMessage);

        let data = '';
        res.on('data', (chunk)=>{
                console.log('data: body: ', data += chunk.toString('utf-8'));
        });
});


req.write(body); //отправляем первую часть

let stream = new fs.ReadStream("MyFile.png");
stream.on('data',(chunk)=>
{
        req.write(chunk); //отправляем вторую часть порциями
        console.log(Buffer.byteLength(chunk));
});
stream.on('end',()=>
{
        req.end(`\r\n--${bound}--\r\n`); //отправляем третью часть
});
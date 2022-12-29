let http = require('http');
let fs = require('fs');

let bound = '---bound--'
let body = `--${bound}\r\n`;
body +='Content-Disposition:form-data; name="file"; Filename="MyFile.txt"\r\n';
body +='Content-Type:text/plain\r\n\r\n';
body +=fs.readFileSync('MyFile.txt');
body +=`\r\n--${bound}--\r\n`;

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


req.on('error', (e)=>{console.log('error: ', e.message);});

req.end(body);
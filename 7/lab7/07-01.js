let http = require('http');
let fs = require('fs');
let path = require('path');
let m07_01 = require('./m07-01')('./static');

let server = http.createServer((req, res) =>
{
    if(req.url == '/')
    {
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(fs.readFileSync('./index.html'));
    }
    else
    {
        if(req.method=='GET')
        {
            switch(path.extname(req.url))
            {
                case '.html':
                    m07_01.sendFile(req, res, {'Content-Type':'text/html; charset=utf-8'});
                    break;
                case '.css':
                    m07_01.sendFile(req, res, {'Content-Type':'text/css; charset=utf-8'});
                    break;
                case '.js':
                    m07_01.sendFile(req, res, {'Content-Type':'text/javascript; charset=utf-8'});
                    break;
                case '.png':
                    m07_01.sendFile(req, res, {'Content-Type':'image/png;'});
                    break;
                case '.docx':
                    m07_01.sendFile(req, res, {'Content-Type':'application/msword; charset=utf-8'});
                    break;
                case '.json':
                    m07_01.sendFile(req, res, {'Content-Type':'application/json; charset=utf-8'});
                    break;
                case '.xml':
                    m07_01.sendFile(req, res, {'Content-Type':'application/xml; charset=utf-8'});
                    break;
                case '.mp4':
                    m07_01.sendFile(req, res, {'Content-Type':'video/mp4; charset=utf-8'});
                    break;

                default:
                    m07_01.writeHTTP404(res);
                    break;
            }
        }
        else
        {
            res.statusCode = 405; //метод запроса известен серверу, но был отключён и не может быть использован.
            res.statusMessage = 'Invalid method';
            res.end("<h1 align='center' >HTTP ERROR 405: This server is processing only GET requests<h1>");
        }
    }
});
server.listen(5000, ()=>{console.log('Server running at http://localhost:5000/')});
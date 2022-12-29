let http = require('http');
let url = require('url');
let fs = require('fs');
const qs = require('qs');
let parseString = require('xml2js').parseString;
let mp=require('multiparty');


let server = http.createServer((req, res)=>{

    let parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.statusCode = '200';
        res.end("First task");
    }
    else if (parsedUrl.pathname === '/second') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.statusCode = '200';
        res.end("Second task");
    }
    else if (parsedUrl.pathname === '/third') {
        let result = '';
        req.on('data', data => { result += data; })

        req.on('end', () => {
            let o = qs.parse(result);
            for (let key in o) {
                result += `${key} = ${o[key]} `;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write('<h2> POST-parameters </h2>  ');
            res.end(result);
        })
    }
    else if (parsedUrl.pathname === '/fourth') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            data = JSON.parse(data);
            res.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
            let comment = 'Ответ.' + data.__comment;
            let resp = {};
            resp.__comment = comment;
            resp.x_plus_y = data.x + data.y;
            resp.Concatenation_s_o = data.s + ': '+data.o.surname + ', ' + data.o.name;
            resp.Length_m = data.m.length;
            res.end(JSON.stringify(resp));
        });
    }
    else if (parsedUrl.pathname === '/fifth') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            parseString(data, function(err, result) {
                res.writeHead(200, {'Content-type': 'application/xml'});
                let id = result.request.$.id;
                let sum = 0;
                let concat = '';
                result.request.x.forEach((p) => {
                    sum += parseInt(p.$.value);
                });
                result.request.m.forEach((p) => {
                    concat += p.$.value;
                });

                let responseText = `<response id="33" request="${id}"><sum element="x" result="${sum}"/><concat element="m" result="${concat}"/></response>`;
                res.end(responseText);
            });
        });
    }
    else if (parsedUrl.pathname === '/sixth_seventh') {
        let result = '';
        let form = new mp.Form({ uploadDir: './static' });

        form.on('field', (name, field) => {
            console.log('-------------------  FIELD  -------------------');
            console.log(field);
            result += `<br/> '${name}' = ${field}`;
        });

        form.on('file', (name, file) => {
            console.log('-------------------  FILE  -------------------');
            console.log(name, file);
            result += `<br/> '${name}': Original filename – ${file.originalFilename}, Filepath – ${file.path}`;
        });

        form.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            console.log(' [ERROR] ', err.message);
            res.end('<h2> [ERROR] Form error. </h2>');
        });

        form.on('close', () => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h2> [OK] Form data: </h2>');
            res.end(result);
        });

        form.parse(req);
    }
    else if (parsedUrl.pathname === '/eight') {
        let path = __dirname+'/MyFile.txt';
        fs.access(path, fs.constants.R_OK, err=>{
            if(err){
                res.statusCode=404;
                res.end('Resource not found!');
            }else{
                fs.createReadStream(path).pipe(res);
            }
        })
    }

}).listen(5000);

console.log('Server running at http://localhost:5000/');
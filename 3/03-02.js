var http = require("http");
var url = require("url");
var fs = require("fs");

let fact = (n)=>{ return (n <= 1 ? n : n*fact(n-1));}

http.createServer(function (request, response)
{
    if (url.parse(request.url).pathname === '/fact')
    {
        if (typeof url.parse(request.url, true).query.k != 'undefined' )
        {
            let k = parseInt(url.parse(request.url, true).query.k);
            if (Number.isInteger(k))
            {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(JSON.stringify({ k:k, fact: fact(k)}));
            }
        }
    }
}).listen(5000);

console.log('Start server at http://localhost:5000/fact?k=5');
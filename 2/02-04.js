const http = require("http");
const fs = require("fs");
  
http.createServer(function(request, response)
{    
    
    if(request.url === "/xmlhttprequest" && request.method == 'GET')
    {
        response.setHeader("Content-Type", "text/html; charset=utf-8;");
        let html = fs.readFileSync('./xmlhttprequest.html');
        response.end(html);
    }
    else if(request.url === "/api/name" && request.method == 'GET')
    {
        response.setHeader("Content-Type", "text/plain; charset=utf-8;");
        response.end("Budanova Ksenya Andreevna");
    }
    else
    {
        response.setHeader("Content-Type", "text/html; charset=utf-8;");
        response.write("<h2>Not found</h2>");
        response.end();
    }
    
}).listen(5000, function()
        {
            console.log('Сервер успешно запущен http://localhost:5000/xmlhttprequest');
        }
    );
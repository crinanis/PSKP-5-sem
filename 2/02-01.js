const http = require("http");
const fs = require("fs");

http.createServer(function(request, response)
    {
        if(request.url === "/html")
        {
            let html = fs.readFileSync('./index.html');
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
        }
        else
        {
            response.setHeader("Content-Type", "text/html; charset=utf-8;");
            response.write("<h2>Not found</h2>");
            response.end();
        }

    }).listen(5000, function()
        {
            console.log('Сервер успешно запущен http://localhost:5000/html');
        }
    );
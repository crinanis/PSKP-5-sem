const http = require("http");
const fs = require("fs");

http.createServer(function(request, response)
    {
        response.setHeader("Content-Type", "text/html; charset=utf-8;");

        if(request.url === "/html")
        {
            let html = fs.readFileSync('./index.html');
            response.end(html);
        }
        else
        {
            response.write("<h2>Not found</h2>");
            response.end();
        }

    }).listen(5000,function()
        {
            console.log('Сервер успешно запущен, порт 5000');
        }
    );
const http = require("http");
const fs = require("fs");
  
http.createServer(function(request, response)
{
    const fname = './pic.jpg';
    let jpg = null;

    if(request.url === "/jpg")
    {
        fs.stat(fname, (err, stat) =>
        {
            if(err)
            {
                console.log('error: ', err);
            }
            else
            {
                jpg = fs.readFileSync(fname);
                response.writeHead(200, {'Content-Type':'image/jpeg', 'Content-Length':stat.size});
                response.end(jpg, 'binary');
            }
        })
    }
    else
    {
        response.setHeader("Content-Type", "text/html; charset=utf-8;");
        response.write("<h2>Not found</h2>");
        response.end();
    }
    
}).listen(5000, function()
        {
            console.log('Сервер успешно запущен http://localhost:5000/jpg');
        }
    );
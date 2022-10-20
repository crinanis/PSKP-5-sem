const http = require('http');
const url = require('url');
const fs = require('fs');
const data = require('./DB');

const db = new data.DataBase();

db.on('GET', async(req, res)=>{
    console.log('DB.GET');
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.write(await  db.select());
    res.end();
});

db.on('POST', async(req, res)=>{
    console.log('DB.POST');
    let person=new data.Human();
            req.on('data', data => {
                person=JSON.parse(data);
                db.insert(person);
            });

    res.end(`id: ${person.id}, name: ${person.name}, birth: ${person.birth}`);
});

db.on('PUT', async (request, response) =>
{
    console.log('DB.PUT');
    let newHuman = new data.Human();

    request.on('data', data =>
    {
        newHuman = JSON.parse(data);
        db.update(newHuman);
    });

    response.end(`id: ${newHuman.id}, name: ${newHuman.name}, birth: ${newHuman.birth}`);
});

db.on('DELETE', async (request, response) =>
{
    console.log('DB.DELETE');
    let removedHuman = new data.Human();

    request.on('data', data =>
    {
        removedHuman = JSON.parse(data);
        db.delete(removedHuman.id);
    });

    response.end(`id: ${removedHuman.id}, name: ${removedHuman.name}, birth: ${removedHuman.birth}`);
});


http.createServer(function (request, response)
{
    if (url.parse(request.url).pathname == '/api/db')
    {
        switch (request.method)
        {
            case 'GET':
            case 'POST':
            case 'PUT':
            case 'DELETE':
                db.emit(request.method, request, response);
                break;
            default:
                break;
        }
    }

    if(request.url == '/')
    {
        response.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
        response.end(fs.readFileSync('./4.html'));
    }

}).listen(5000, () =>
{
    console.log('Start server at http://localhost:5000/');
});
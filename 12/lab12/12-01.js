const http = require('http');
const fs = require('fs');
const websocket = require('ws');

const pathToFile = './file/StudentList.json';

const getHandler = require('./getHandler');
const postHandler = require('./postHandler');
const putHandler = require('./putHandler');
const deleteHandler = require('./deleteHandler');

http.createServer((request, response) => {
    switch(request.method) {
        case 'GET': getHandler(request, response); break;
        case 'POST': postHandler(request, response); break;
        case 'PUT': putHandler(request, response); break;
        case 'DELETE': deleteHandler(request, response); break;
    }
}).listen(5001);

let wss = new websocket.Server({port: 4001, host: 'localhost'});

fs.watch(pathToFile, {encoding: 'buffer'}, (eventType, filename) => {
    if(eventType === 'change') {
        wss.clients.forEach((client) => {
            if (client.readyState === websocket.OPEN) {
                client.send(`Файл ${filename} был изменен`);
            }
        });
    }
});

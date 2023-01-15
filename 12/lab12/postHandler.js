const fs = require('fs');
const url = require('url');

const errHandler = require('./errorHandler');
const readFile = require('./readFile');
const pathToFile = './file/StudentList.json';

module.exports = (request, response) => {
    let path = url.parse(request.url).pathname;
    if(path === '/') {
            let body = '';
            request.on('data', function (data) {
                body += data;
            });
            request.on('end', function () {
                let flag = true;
                let fileJSON = JSON.parse(readFile());
                fileJSON.forEach(item => {
                    if(item.id === JSON.parse(body).id) {
                        flag = false;
                    }
                });
                if(flag) {
                    fileJSON.push(JSON.parse(body));
                    fs.writeFile(pathToFile, JSON.stringify(fileJSON), (e) => {
                        if (e) {
                            console.log('Error');
                            errHandler(request, response, e.code, e.message);
                        }
                        else {
                            console.log('Добавлен студент');
                            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            response.end(JSON.stringify(JSON.parse(body)));
                        }
                    });
                }
                else {
                    errHandler(request, response, 2, `Студент с id  ${JSON.parse(body).id} уже существует`);
                }
            });
    }
    else if(path === '/backup') {
        let date = new Date();

        let month = (date.getMonth() + 1) < 10? "0" + (date.getMonth() + 1).toString(): date.getMonth() + 1;
        let day = (date.getDate()) < 10? "0" + date.getDate().toString(): date.getDate();
        let hour = (date.getHours()) < 10? "0" + date.getHours().toString(): date.getHours();
        let second = (date.getSeconds()) < 10? "0" + date.getSeconds().toString(): date.getSeconds();

        let MyDate = date.getFullYear() + month + day + hour + second;
        console.log(date.toLocaleDateString());
        console.log(date.toLocaleTimeString());
        setTimeout( () =>
        {
            fs.copyFile(pathToFile, `./backup/${MyDate}_StudentList.json`, (err) =>
            {
                if (err)
                {
                    console.log('Error');
                    response.end(getErrorJSON(103, 'unknown error (post_handler, creating new file copy)'));
                }
                else
                {
                    console.log('File is copied');
                    response.end('Ok');
                }
            });
        }, 2000);
}
    else {
        response.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(`Error 404`);
    }
};
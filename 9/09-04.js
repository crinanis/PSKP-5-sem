let http = require('http');

let json = JSON.stringify(
    {
        "__comment": "Запрос. Лабораторная работа №9",
        "x": 1,
        "y": 2,
        "s": "Сообщение: ",
        "m": ["a", "b", "c", "d"],
        "o": {"surname":"Буданова", "name":"Ксения"}
    }
);

let options =
    {
    host: 'localhost',
    path: `/fourth`,
    port: 5000,
    method:'POST',
    headers: { 'content-type':'application/json', 'accept':'application/json' }
}

const req = http.request(options,(res)=>
{
    console.log('http.request: statusCode: ',res.statusCode);
    let data = '';
    res.on('data',(chunk) => {console.log('http.request: data: body=', data+=chunk.toString('utf-8'));});
    res.on('end',() => { console.log('http.request: end: body=', data);console.log('http.request: end: parse(body)=', JSON.parse(data));});
});

req.write(json);
req.end();
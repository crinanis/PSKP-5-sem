const http = require("http");
const process = require('process');
var state = 'norm';

http.createServer(function (request, response)
{
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(`<h1>${state}<h1>`);

}).listen(3000, () => {console.log('Start server at http://localhost:3000');});

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () =>
{
    let chunk = null;
    while ((chunk = process.stdin.read()) != null)
    {
        let trimmed_chunk = chunk.trim();
        switch (trimmed_chunk)
        {
            case 'exit':
                console.log(`${state} -> ${trimmed_chunk}`);
                process.exit(0);
                break;

            case 'norm':
                console.log(`${state} -> ${trimmed_chunk}`);
                state = 'norm';
                break;

            case 'stop':
                console.log(`${state} -> ${trimmed_chunk}`);
                state = 'stop';
                break;

            case 'test':
                console.log(`${state} -> ${trimmed_chunk}`);
                state = 'test';
                break;

            case 'idle':
                console.log(`${state} -> ${trimmed_chunk}`);
                state = 'idle';
                break;

            default:
                console.log(`Undefined state: ${trimmed_chunk}`);
                break;
        }
    }
});



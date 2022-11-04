const http = require("http");
const url = require("url");
const fs = require("fs");
const { parse } = require("querystring");
const nodemailer = require("nodemailer");
const send = require("bka6-4");
//const send = require("c:\\Users\\budan\\AppData\\Roaming\\npm\\node_modules\\bka6-4\\send");


const server = http.createServer().listen(5000);
console.log("http://localhost:5000/");

server.on("request", (req, res) => {
    const path = url.parse(req.url).pathname;

    if (path === "/" && req.method === "GET") {
        fs.readFile("mail.html", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    } else if (path === "/" && req.method === "POST") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            let params = parse(body);

            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: params.sender,
                    pass: params.password,
                },
            });

            const options = {
                from: params.sender,
                to: params.receiver,
                subject: "Lab6 mail",
                text: params.message,
            };

            send(params.message);
            transporter.sendMail(options, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(info);
                }
            });

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`<h1>${params.message}</h1>`);
        });
    }
});
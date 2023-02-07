const {MongoClient, ObjectID} = require('mongodb');
let http = require('http');
let url = require('url');

const urls = "mongodb://localhost:27017/";
const client = new MongoClient(urls);


async function run(req, res) {
    switch (req.method) {
        case 'GET': {
            switch (true) {
                case url.parse(req.url).pathname.includes('/api/pulpit') || url.parse(req.url).pathname.includes('/api/faculty'):
                    try {
                        let faculty = decodeURI(url.parse(req.url, true).query.f);
                        console.log(faculty);
                        let table = url.parse(req.url).pathname.replace("/api/", "");
                        console.log(table)
                        let xyz = decodeURI(url.parse(req.url).pathname.replace(`/api/${table}/`, ""));
                        console.log(xyz)
                        let faculty_pulpit = table.substring(0, table.indexOf("/"));
                        console.log(faculty_pulpit)
                        let xyz1 = decodeURI(url.parse(req.url).pathname.replace(`/api/${faculty_pulpit}/`, ""));
                        console.log(xyz1);

                        await client.connect();
                        const db = client.db("BSTU");
                        let collection_name = url.parse(req.url).pathname.split('/')[2];
                        let collection = db.collection(collection_name);

                        await db.collection("pulpit").createIndex({pulpit: 1}, {unique: true});
                        await db.collection("faculty").createIndex({faculty: 1}, {unique: true});
                        //await collection.dropIndexes();

                        if ((faculty_pulpit === 'pulpit') && (xyz1 != '')) {
                            collection.find({pulpit: `${xyz1}`}).toArray((err, docs) => {
                                if (err) {
                                    console.log('collection.find error', err);
                                } else {
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify(docs));
                                }
                            })
                        }
                        if ((faculty_pulpit === 'faculty') && (xyz1 != '')) {
                            collection.find({faculty: `${xyz1}`}).toArray((err, docs) => {
                                if (err) {
                                    console.log('collection.find error', err);
                                } else {
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify(docs));
                                }
                            })
                        }
                        if ((faculty_pulpit != '') && (faculty != NaN)) {

                            collection.find({faculty: `${faculty}`}).toArray((err, docs) => {
                                if (err) {
                                    console.log('collection.find error', err);
                                } else {
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify(docs));
                                }
                            })
                        }
                        if ((table === 'faculty') || (table === 'pulpit') && (faculty_pulpit === '')) {
                            let facs = faculty.split(',');//this line fixes error with "$in might be used with array"

                            if (facs.length > 1) {
                                console.log("puk");
                                collection.find({faculty: {$in: facs}}).toArray((err, docs) => {
                                    if (err) {
                                        console.log('collection.find error', err);
                                    } else {
                                        res.writeHead(200, {'Content-Type': 'application/json'});
                                        res.end(JSON.stringify(docs));
                                    }
                                })
                            } else {
                                collection.find({}).toArray((err, docs) => {
                                    if (err) {
                                        console.log('collection.find error', err);
                                    } else {
                                        res.writeHead(200, {'Content-Type': 'application/json'});
                                        res.end(JSON.stringify(docs));
                                    }
                                })
                            }
                        }
                    } catch (err) {
                        console.log(err);
                    } finally {
                        // await client.close();
                    }
                    break;
                default:
                    break;
            }
            break;
        }
        case 'POST':
            switch (true) {
                case url.parse(req.url).pathname == '/api/faculty':
                    try {
                        let body = '';
                        req.on('data', chunk => {
                            body += chunk.toString();
                        });
                        req.on('end', async () => {
                            await client.connect();
                            const db = client.db("BSTU");
                            let collection_name = url.parse(req.url).pathname.split('/')[2];
                            let collection = db.collection(collection_name);
                            let o = JSON.parse(body);

                            collection.findOne({faculty: `${o.faculty}`}).then(record => {
                                if (record == null) {
                                    collection.insertOne(o, function (err, result) {
                                        if (err) {
                                            console.log('collection.find error', err);
                                        } else {
                                            res.writeHead(200, {'Content-Type': 'application/json'});
                                            res.end(JSON.stringify(result));
                                        }
                                    });
                                } else res.end("exists");
                            })
                        });
                    } catch (err) {
                        console.log(err);
                    } finally {
                        // await client.close();
                    }
                    break;

                case url.parse(req.url).pathname == '/api/pulpit':
                    try {

                        let body = '';
                        req.on('data', chunk => {
                            body += chunk.toString();
                        });
                        req.on('end', async () => {
                            await client.connect();
                            const db = client.db("BSTU");
                            let collection_name = url.parse(req.url).pathname.split('/')[2];
                            let collection = db.collection(collection_name);
                            let o = JSON.parse(body);

                            collection.findOne({pulpit: `${o.pulpit}`}).then(record => {
                                if (record == null) {
                                    collection.insertOne(o, function (err, result) {
                                        if (err) {
                                            console.log('collection.find error', err);
                                        } else {
                                            res.writeHead(200, {'Content-Type': 'application/json'});
                                            res.end(JSON.stringify(result));
                                        }
                                    });
                                } else res.end("exists");
                            })
                        });
                    } catch (err) {
                        console.log(err);
                    } finally {
                        // await client.close();
                    }
                    break;
                case url.parse(req.url).pathname == '/transaction':
                    try {
                        let body='';
                        req.on('data',chunk=>{body+=chunk;});
                        req.on('end',async () => {

                            await client.connect();
                            const transqctionOptions = {
                                readConcern: {level: 'local'},
                                writeConcern: {w: 'majority'}
                            }
                            const session = client.startSession();
                            try {
                                await session.withTransaction(async()=>{
                                    const db = client.db("BSTU");
                                    let collection = db.collection('pulpit');
                                    let o = JSON.parse(body);
                                    await collection.insertMany(o, {session});
                                    res.writeHead(200, {'Content-Type': 'application/json'});
                                    res.end('inserted');

                                },transqctionOptions);
                            }
                            catch (e)
                            {
                                console.log(e.message)
                                res.end(JSON.stringify(e.message));
                            }
                            finally {
                                await  session.endSession();

                            }
                        })
                    }catch(err) {
                        console.log(err);
                    } finally {
                        // await client.close();
                    }
                    break;
                default:
                    break;
            }
            break;
        case 'PUT':
            switch (true) {
                case url.parse(req.url).pathname == '/api/pulpit' || url.parse(req.url).pathname == '/api/faculty':
                    try {

                        let body = '';
                        req.on('data', chunk => {
                            body += chunk.toString();
                        });
                        req.on('end', async () => {
                            await client.connect();
                            const db = client.db("BSTU");
                            let collection_name = url.parse(req.url).pathname.split('/')[2];

                            let o = JSON.parse(body);
                            if (collection_name == 'faculty') {
                                let collection = db.collection(collection_name);
                                collection.findOneAndUpdate({_id: ObjectID(o._id)}, {
                                    $set: {
                                        faculty: o.faculty,
                                        faculty_name: o.faculty_name
                                    }
                                }, {returnOriginal: false}, function (err, result) {
                                    if (err) {
                                        console.log('collection.find error', err);
                                    } else {
                                        if (result.value == null) {
                                            res.end(`"error" : "3","message" : "Уже изменено"`);
                                        } else {
                                            res.writeHead(200, {'Content-Type': 'application/json'});
                                            res.end(JSON.stringify(result.value));
                                        }
                                    }

                                });
                            }
                            if (collection_name == 'pulpit') {
                                let collection = db.collection(collection_name);
                                collection.findOneAndUpdate({_id: ObjectID(o._id)}, {
                                    $set: {
                                        pulpit: o.pulpit,
                                        faculty: o.faculty,
                                        pulpit_name: o.pulpit_name
                                    }
                                }, {returnOriginal: false}, function (err, result) {
                                    if (err) {
                                        console.log('collection.find error', err);
                                    } else {
                                        if (result.value == null) {
                                            res.end(`"error":"3","message":"Уже изменено"`);
                                        } else {
                                            res.writeHead(200, {'Content-Type': 'application/json'});
                                            res.end(JSON.stringify(result.value));
                                        }
                                    }
                                });
                            }
                        });
                    } catch (err) {
                        console.log(err);
                    } finally {
                        // await client.close();
                    }
                    break;
                default:
                    break;
            }
            break;
        case 'DELETE':
            switch (true) {
                case url.parse(req.url).pathname.includes('faculty/') || url.parse(req.url).pathname.includes('pulpit/'):
                    try {

                        let body = '';
                        req.on('data', chunk => {
                            body += chunk.toString();
                        });
                        req.on('end', async () => {
                            await client.connect();
                            const db = client.db("BSTU");
                            let collection_name = url.parse(req.url).pathname.split('/')[2];
                            console.log(collection_name);
                            let o = decodeURI(url.parse(req.url, true).pathname).split('/')[3];
                            if (collection_name == 'faculty') {
                                let collection = db.collection(collection_name);
                                await collection.findOneAndDelete({faculty: o}, (err, result) => {
                                    if (err) {
                                        console.log('collection.find error', err);
                                    } else {
                                        if (result.value == null) {
                                            res.end(`"error":"1","message":"Уже удалено"`);
                                        } else {
                                            res.writeHead(200, {'Content-Type': 'application/json'});
                                            res.end(JSON.stringify(result.value));
                                        }
                                    }
                                });
                            }
                            if (collection_name == 'pulpit') {
                                let collection = db.collection(collection_name);
                                await collection.findOneAndDelete({pulpit: o}, function (err, result) {
                                    if (err) {
                                        console.log('collection.find error', err);
                                    } else {
                                        if (result.value == null) {
                                            res.end(`"error":"1","message":"Уже удалено"`);
                                        } else {
                                            res.writeHead(200, {'Content-Type': 'application/json'});
                                            res.end(JSON.stringify(result.value));
                                        }
                                    }

                                });
                            }
                        });
                    } catch (err) {
                        console.log(err);
                    } finally {
                        // await client.close();
                    }
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
}

http.createServer((req, res) => {
    try {
        run(req, res).catch(console.error);
    } catch (e) {
        console.error(e);
    }

}).listen(3000, () => {
    console.log('Server has started on http://localhost:3000')
});
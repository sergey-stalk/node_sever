import express from 'express';
import bodyParser from 'body-parser'
const app = express();
const port = 8080;




const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';

MongoClient.connect(url, (err, client) => {

	const db = client.db('diplom');
	const collection = db.collection('lessons');

	if (err) throw err;
	console.log('Connection established');
	collection.find().toArray((err, results) => {
                 
        console.log(results);
        client.close();
    });
});
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json())


app.get('/admin', (res) => {
	const datag = {
		"name": "Вася",
		"age": 35,
		"isAdmin": false,
		"friends": [0, 1, 2, 3]
	}
	/* res.writeHead(200, {'ContentType': 'text/html'}); */
	res.send(datag);
	res.write('fuck')
	res.end();
});

const server = app.listen(port, () => {
	console.log('Server is up and running on port ' + port)
});
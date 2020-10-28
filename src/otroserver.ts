const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');

const path = require('path');
const app = express();
app.use(bodyParser.json());

const router = express.Router();

router.get('/', (req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write('<h1>Hello from Express.js!</h1>');
	res.end();
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use('/.netlify/functions/server/otro', router); // path must route to lambda
module.exports = app;
module.exports.handler = serverless(app);

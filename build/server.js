"use strict";
var express = require('express');
var path = require('path');
var serverless = require('serverless-http');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
router.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello from Express.js!</h1>');
    res.end();
});
router.get('/another', function (req, res) { return res.json({ route: req.originalUrl }); });
router.post('/', function (req, res) { return res.json({ postBody: req.body }); });
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router); // path must route to lambda
app.use('/', function (req, res) { return res.sendFile(path.join(__dirname, '../index.html')); });
module.exports = app;
module.exports.handler = serverless(app);

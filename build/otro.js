"use strict";
var express = require('express');
var serverless = require('serverless-http');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
app.use(bodyParser.json());
var router = express.Router();
router.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello from Express.js!</h1>');
    res.end();
});
router.get('/another', function (req, res) { return res.json({ route: req.originalUrl }); });
router.post('/', function (req, res) { return res.json({ postBody: req.body }); });
app.use('/.netlify/functions/otro', router); // path must route to lambda
module.exports = app;
module.exports.handler = serverless(app);

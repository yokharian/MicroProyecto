"use strict";
var express = require('express');
var path = require('path');
var serverless = require('serverless-http');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
router.get('/', function (_, res) {
    res.send('ok');
});
router.get('/okey', function (_, res) {
    res.send('okboomer');
});
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router); // path must route to lambda
app.use('/', function (_, res) { return res.sendFile(path.join(__dirname, '../index.html')); });
module.exports = app;
module.exports.handler = serverless(app);

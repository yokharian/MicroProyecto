"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverless_http_1 = __importDefault(require("serverless-http"));
var path_1 = require("path");
var apiName = 'TimeStamp';
var path = '/.netlify/functions/';
var app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
var router = express_1.default.Router();
router.get('/api/:date_string?', function (req, res) {
    var reqDate = new Date(req.params.date_string);
    var responseDate = !isNaN(reqDate.getTime()) ? reqDate : new Date();
    var response = {
        unix: responseDate.getTime(),
        utc: responseDate.toUTCString(),
    };
    return res.json(response);
});
router.get('/', function (_, res) {
    var fs = require('fs');
    var path = __dirname;
    recursiveloop(path, function (err, result) {
        /* begin processing of each result */
        // For each file in the array
        for (var i = 0; i < result.length; i++) {
            //Write the name of the file
            console.log('Processing: ' + result[i]);
            //Read the file
            fs.readFile(result[i], 'utf8', function (err, data) {
                //If there is an error notify to the console
                if (err)
                    console.log('Error: ' + err);
                //Parse the json object
                var obj = JSON.parse(data);
                //Print out contents
                console.log('Name: ' + obj.name);
                console.log('Position: ' + obj.position);
            });
        }
    });
    function recursiveloop(dir, done) {
        var results = [];
        fs.readdir(dir, function (err, list) {
            if (err)
                return done(err);
            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file)
                    return done(null, results);
                file = dir + '/' + file;
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        recursiveloop(file, function (err, res) {
                            results = results.concat(res);
                            next();
                        });
                    }
                    else {
                        results.push(file);
                        next();
                    }
                });
            })();
        });
    }
    res.sendFile(path_1.join(__dirname, '../public/html/timeStamp.html'));
});
app.use(path + apiName.toLowerCase(), router); // path must route to lambda
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

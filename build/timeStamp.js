"use strict";
///
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverless_http_1 = __importDefault(require("serverless-http"));
var path_1 = require("path");
var apiName = 'timestamp';
var path = '/.netlify/functions/server/';
var app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
console.log('Starting headParser.js');
var router = express_1.default.Router();
router.get('/api/timestamp/:date_string?', function (req, res) {
    var reqDate = new Date(req.params.date_string);
    var responseDate = !isNaN(reqDate.getTime()) ? reqDate : new Date();
    var response = {
        unix: responseDate.getTime(),
        utc: responseDate.toUTCString(),
    };
    return res.json(response);
});
router.get('/', function (req, res) {
    res.send('hello world from timestamp');
});
app.use('/', router);
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

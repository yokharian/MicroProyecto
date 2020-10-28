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
app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
router.get('/:date_string?', function (req, res) {
    var reqDate = new Date(req.params.date_string);
    var responseDate = !isNaN(reqDate.getTime()) ? reqDate : new Date();
    var response = {
        unix: responseDate.getTime(),
        utc: responseDate.toUTCString(),
    };
    return res.json(response);
});
router.get('/', function (_, res) {
    return res.sendFile(path_1.join(__dirname + '../public/html/timeStamp.html'));
});
app.use(path + apiName.toLowerCase(), router); // path must route to lambda
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

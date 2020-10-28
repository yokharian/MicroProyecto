"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverless_http_1 = __importDefault(require("serverless-http"));
var path_1 = require("path");
var fileName = 'server';
var path = '/.netlify/functions/';
var app = express_1.default();
app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
var router = express_1.default.Router();
app.use(path + fileName.toLowerCase() + '/api', router); // path must route to lambda
app.use(path + fileName.toLowerCase(), function (_, res) {
    res.write("<!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Document</title>\n    </head>\n    <body>\n        hello\n    </body>\n    </html>");
    res.end();
});
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

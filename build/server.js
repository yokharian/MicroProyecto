"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverless_http_1 = __importDefault(require("serverless-http"));
var app = express_1.default();
console.log('Starting Server.js');
require('./routes/').default({
    app: app,
    path: '/.netlify/functions/server/',
    exclude: '(deprecated)|(timeStamp)|(tracker)|(urlshort)|(fileMeta)',
});
app.use('/public', express_1.default.static(require('path').join(__dirname, '../public/')));
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

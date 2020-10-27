"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.clear();
var express_1 = __importDefault(require("express"));
var path_1 = require("path");
if (!process.env.netlify || true) {
    var app = express_1.default();
    console.log('Starting Server.js');
    require('./routes/').default({
        app: app,
        path: '/.netlify/functions/server/',
        exclude: '(deprecated)|(timeStamp)|(tracker)|(urlshort)|(fileMeta)',
    });
    app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
    app.use('/', function (_, res) { return res.sendFile(path_1.join(__dirname, '../index.html')); });
    console.log('LOCAL_MODE=true');
    app.listen(3000, function () { return console.log('Local app listening on port 3000!'); });
}

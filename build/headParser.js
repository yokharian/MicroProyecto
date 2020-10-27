"use strict";
///
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverless_http_1 = __importDefault(require("serverless-http"));
var path_1 = require("path");
var path = '/.netlify/functions/server/';
var app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
console.log('Starting headParser.js');
var router = express_1.default.Router();
router.get('/', function (_, res) {
    return res.sendFile(path_1.join(__dirname, '../public/html/headParser.html'));
});
router.get('/hola', function (_, res) { return res.json({ 'hola': 'hola' }); });
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

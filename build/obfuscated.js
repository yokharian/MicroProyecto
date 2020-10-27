"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// NETLIFY ADAPTATION /////////////
var express_1 = __importDefault(require("express"));
var serverless_http_1 = __importDefault(require("serverless-http"));
var path_1 = require("path");
var app = express_1.default();
console.log('Starting Server.js');
var listaDeRoutes = {
    headParser: function (app) {
        var join = require('path').join;
        var publicHtml = join(__dirname, '../../public/html');
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        var router = express_1.default.Router();
        router.get('/', function (_, res) {
            return res.sendFile(join(publicHtml, 'headParser.html'));
        });
        router.get('/hola', function (_, res) { return res.json({ 'hola': 'hola' }); });
        return router;
    },
};
Object.entries(listaDeRoutes).forEach(function (api) {
    var path = '/.netlify/functions/server/';
    var apiName = api[0].toLowerCase();
    var router = api[1](app);
    app.use(path + apiName, router);
});
console.log('LOADED', Object.keys(listaDeRoutes).map(function (v) { return v.toLowerCase(); }));
app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
app.use('/', function (_, res) { return res.sendFile(path_1.join(__dirname, '../index.html')); });
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

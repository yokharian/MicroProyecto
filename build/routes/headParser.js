"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
exports.default = (function (app) {
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
});

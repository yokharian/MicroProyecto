"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverless = require('serverless-http');
var app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
var headParser = express_1.default.Router();
headParser.get("/", function (req, res) {
    return res.json({ "hola": "hola" });
});
app.use("/.netlify/functions/headparser", headParser);
module.exports.handler = serverless(app);

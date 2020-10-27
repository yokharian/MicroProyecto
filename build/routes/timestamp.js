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
var timeStamp = express_1.default.Router();
timeStamp.get("/:date_string?", function (req, res) {
    var reqDate = new Date(req.params.date_string);
    var responseDate = !isNaN(reqDate.getTime()) ? reqDate : new Date();
    var response = {
        unix: responseDate.getTime(),
        utc: responseDate.toUTCString(),
    };
    return res.json(response);
});
app.use("/.netlify/functions/timestamp", timeStamp);
module.exports.handler = serverless(app);

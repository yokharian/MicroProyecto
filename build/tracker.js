"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var serverless_http_1 = __importDefault(require("serverless-http"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var path = '/.netlify/functions/';
var fileName = 'tracker';
mongoose_1.default.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track');
var app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
// Not found middleware
app.use(function (req, res, next) {
    return next({ status: 404, message: 'not found' });
});
// Error Handling middleware
app.use(function (err, req, res, next) {
    var errCode, errMessage;
    if (err.errors) {
        // mongoose validation error
        errCode = 400; // bad request
        var keys = Object.keys(err.errors);
        // report the first validation error
        errMessage = err.errors[keys[0]].message;
    }
    else {
        // generic or custom error
        errCode = err.status || 500;
        errMessage = err.message || 'Internal Server Error';
    }
    res.status(errCode).type('txt').send(errMessage);
});
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var serverless_http_1 = __importDefault(require("serverless-http"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = require("dotenv");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var path_1 = require("path");
dotenv_1.config();
var path = '/.netlify/functions/';
var fileName = 'exercise';
//#region configs
var app = express_1.default();
/** this project needs a db !! **/
mongoose_1.default.connect(process.env.DB_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
var db = mongoose_1.default.connection;
db.on('error', function (err) {
    console.log('connection error', err);
});
db.once('open', function () {
    console.log('Connection to DB successful');
});
// create application/json parser
app.use(body_parser_1.default.urlencoded({ extended: false }));
// create application/x-www-form-urlencoded parser
app.use(body_parser_1.default.json());
// http://expressjs.com/en/starter/static-files.html
app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
app.use(cors_1.default({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
var router = express_1.default.Router();
//#endregion configs
// Not found middleware
router.use(function (req, res, next) {
    return next({ status: 404, message: 'not found' });
});
// Error Handling middleware
router.use(function (err, req, res, next) {
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
router.get('/log');
//#region configs
app.use(path + fileName.toLowerCase() + '/api/' + fileName.toLowerCase(), router); // path must route to lambda
// index
app.get(path + fileName.toLowerCase(), function (_, res) {
    res.write("<!DOCTYPE html>\n\t\t<html>\n\t\t\n\t\t   <head>\n\t\t\t  <title>Exercise Tracker | Free Code Camp</title>\n\t\t\t  <link rel=\"shortcut icon\" href=\"https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico\" type=\"image/x-icon\"/>\n\t\t\t  <link href=\"https://fonts.googleapis.com/css?family=Roboto\" rel=\"stylesheet\" type=\"text/css\">\n\t\t\t  <link href=\"/public/css/tracker.css\" rel=\"stylesheet\" type=\"text/css\">\n\t\t   </head>\n\t\t\n\t\t   <body>\n\t\t\t  <div class=\"container\">\n\t\t\t\t <h1>Exercise tracker</h1>\n\t\t\t\t  <form action=\"tracker/api/exercise/new-user\" method=\"post\">\n\t\t\t\t\t<h3>Create a New User</h3>\n\t\t\t\t\t<p><code>POST /api/exercise/new-user</code></p>\n\t\t\t\t\t<input id=\"uname\" type=\"text\" name=\"username\" placeholder=\"username\">\n\t\t\t\t\t<input type=\"submit\" value=\"Submit\">\n\t\t\t\t  </form>\n\t\t\t\t  <form action=\"tracker/api/exercise/add\" method=\"post\">\n\t\t\t\t\t<h3>Add exercises</h3>\n\t\t\t\t\t<p><code>POST /api/exercise/add</code></p>\n\t\t\t\t\t<input id=\"uid\" type=\"text\" name=\"userId\" placeholder=\"userId*\">\n\t\t\t\t\t<input id=\"desc\" type=\"text\" name=\"description\" placeholder=\"description*\">\n\t\t\t\t\t<input id=\"dur\" type=\"text\" name=\"duration\" placeholder=\"duration* (mins.)\">\n\t\t\t\t\t<input id=\"dat\" type=\"text\" name=\"date\" placeholder=\"date (yyyy-mm-dd)\">\n\t\t\t\t\t<input type=\"submit\" value=\"Submit\">\n\t\t\t\t  </form>\n\t\t\t\t  <p><strong>GET users's exercise log: </strong><code>GET /api/exercise/log?{userId}[&amp;from][&amp;to][&amp;limit]</code></p>\n\t\t\t\t  <p><strong>{ }</strong> = required, <strong>[ ]</strong> = optional</p>\n\t\t\t\t  <p><strong>from, to</strong> = dates (yyyy-mm-dd); <strong>limit</strong> = number</p>\n\t\t\t  </div>\n\t\t\t  <div class=\"footer\">\n\t\t\t\t <p>\n\t\t\t\t   By <a href=\"https://www.noicefluid.com/\">Dra. Paiton</a>\n\t\t\t\t </p>\n\t\t\t   </div>\n\t\t   </body>\n\t\t\n\t\t</html>\n\t\t");
    res.end();
});
module.exports = app;
module.exports.handler = serverless_http_1.default(app);
//#endregion

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverless_http_1 = __importDefault(require("serverless-http"));
var path_1 = require("path");
var fileName = 'headparser';
var path = '/.netlify/functions/';
var app = express_1.default();
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
// http://expressjs.com/en/starter/static-files.html
app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
var router = express_1.default.Router();
router.get('/whoami', function (req, res) {
    res.json({
        ipaddress: req.headers['host'],
        language: req.headers['accept-language'],
        software: req.headers['user-agent'],
    });
});
app.use(path + fileName.toLowerCase() + '/api', router); // path must route to lambda
app.use(path + fileName.toLowerCase(), function (_, res) {
    res.write("<!DOCTYPE html>\n\n    <html>\n    \n       <head>\n          <title>Request Header Parser</title>\n          <link rel=\"shortcut icon\" href=\"https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico\" type=\"image/x-icon\"/>\n          <link href=\"https://fonts.googleapis.com/css?family=Roboto\" rel=\"stylesheet\" type=\"text/css\">\n          <link href=\"/public/css/headParser.css\" rel=\"stylesheet\" type=\"text/css\">\n       </head>\n    \n       <body>\n          <div class=\"container\">\n            <h2>Request Header Parser Microservice</h2>\n    \n            <h3>Example Usage:</h3>\n            <p>\n              [base url]/api/whoami\n            </p>\n    \n            <h3>Example Output:</h3>\n            <p>\n              <code>{\"ipaddress\":\"::ffff:159.20.14.100\",\"language\":\"en-US,en;q=0.5\",<br>\"software\":\"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0\"}</code>\n            </p>\n          </div>\n          <div class=\"footer\">\n            <p>\n              By <a href=\"https://www.noicefluid.com/\">Dra. Paiton</a>\n            </p>\n          </div>\n       </body>\n    \n    \n    </html>");
    res.end();
});
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverless_http_1 = __importDefault(require("serverless-http"));
var path_1 = require("path");
var fileName = 'timeStamp';
var path = '/.netlify/functions/';
var app = express_1.default();
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
// http://expressjs.com/en/starter/static-files.html
app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
var router = express_1.default.Router();
router.get('/:date_string?', function (req, res) {
    var reqDate = new Date(req.params.date_string);
    var responseDate = !isNaN(reqDate.getTime()) ? reqDate : new Date();
    var response = {
        unix: responseDate.getTime(),
        utc: responseDate.toUTCString(),
    };
    return res.json(response);
});
app.use(path + fileName.toLowerCase() + '/api/' + fileName.toLowerCase(), router); // path must route to lambda
// index
app.get(path + fileName.toLowerCase(), function (_, res) {
    res.write("<!DOCTYPE html>\n\n\t\t<html>\n\t\t\n\t\t   <head>\n\t\t\t  <title>Timestamp Microservice</title>\n\t\t\t  <link rel=\"shortcut icon\" href=\"https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico\" type=\"image/x-icon\"/>\n\t\t\t  <link href=\"https://fonts.googleapis.com/css?family=Roboto\" rel=\"stylesheet\" type=\"text/css\">\n\t\t\t  <link href=\"/public/css/timestamp.css\" rel=\"stylesheet\" type=\"text/css\">\n\t\t   </head>\n\t\t\n\t\t   <body>\n\t\t\n\t\t\t  <div class=\"container\">\n\t\t\t\t<h2>API Project: Timestamp Microservice</h2>\n\t\t\t\t<h3>User Stories:</h3>\n\t\t\t\t<ol class=\"user-stories\">\n\t\t\t\t  \n\t\t\t\t  <li>The API endpoint is <code>GET [project_url]/api/timestamp/:date_string?</code></li>\n\t\t\t\t  <li>A date string is valid if can be successfully parsed by <code>new Date(date_string)</code>.<br>\n\t\t\t\t  Note that the unix timestamp needs to be an <strong>integer</strong> (not a string) specifying <strong>milliseconds</strong>.<br> \n\t\t\t\t  In our test we will use date strings compliant with ISO-8601 (e.g. <code>\"2016-11-20\"</code>) because this will ensure an UTC timestamp.</li>\n\t\t\t\t  <li>If the date string is <strong>empty</strong> it should be equivalent to trigger <code>new Date()</code>, i.e. the service uses the current timestamp.</li>\n\t\t\t\t  <li>If the date string is <strong>valid</strong> the api returns a JSON having the structure<br><code>{\"unix\": &lt;date.getTime()&gt;, \"utc\" : &lt;date.toUTCString()&gt; }</code><br>\n\t\t\t\t\te.g. <code>{\"unix\": 1479663089000 ,\"utc\": \"Sun, 20 Nov 2016 17:31:29 GMT\"}</code></li>\n\t\t\t\t  <li>If the date string is <strong>invalid</strong> the api returns a JSON having the structure <br>\n\t\t\t\t\t  <code>{\"error\" : \"Invalid Date\" }</code>.\n\t\t\t\t  </li>\n\t\t\t\t</ol>\n\t\t\n\t\t\t\t<h3>Example Usage:</h3>\n\t\t\t\t<ul>\n\t\t\t\t  <li><a href=\"/api/timestamp/2015-12-25\">[project url]/api/timestamp/2015-12-25</a></li>\n\t\t\t\t  <li><a href=\"/api/timestamp/1451001600000\">[project url]/api/timestamp/1451001600000</a></li>\n\t\t\t\t</ul>\n\t\t\n\t\t\t\t<h3>Example Output:</h3>\n\t\t\t\t<p>\n\t\t\t\t  <code>{\"unix\":1451001600000, \"utc\":\"Fri, 25 Dec 2015 00:00:00 GMT\"}</code>\n\t\t\t\t</p>\n\t\t\t  </div>\n\t\t\t  <div class=\"footer\">\n\t\t\t\t<p>\n\t\t\t\t  By <a href=\"https://www.noicefluid.com/\">Dra. Paiton</a>\n\t\t\t\t</p>\n\t\t\t  </div>\n\t\t   </body>\n\t\t\n\t\t</html>");
    res.end();
});
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

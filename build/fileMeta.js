"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serverless_http_1 = __importDefault(require("serverless-http"));
var path_1 = require("path");
var body_parser_1 = __importDefault(require("body-parser"));
var fileName = 'filemeta';
var path = '/.netlify/functions/';
var multer = require('multer');
var upload = multer();
var app = express_1.default();
// create application/json parser
app.use(body_parser_1.default.urlencoded({ extended: false }));
// create application/x-www-form-urlencoded parser
app.use(body_parser_1.default.json());
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
// http://expressjs.com/en/starter/static-files.html
app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
var router = express_1.default.Router();
router.post('/fileanalyse', upload.single('upfile'), function (req, res, next) {
    var file = req.file;
    if (!file) {
        var error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.json({ name: file.originalname, type: file.mimetype, size: file.size });
});
app.use(path + fileName.toLowerCase() + '/api', router); // path must route to lambda
app.use(path + fileName.toLowerCase(), function (_, res) {
    res.write("<!DOCTYPE html>\n\n        <html>\n        \n           <head>\n              <title>File Metadata</title>\n              <link rel=\"shortcut icon\" href=\"https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico\" type=\"image/x-icon\"/>\n              <link href=\"https://fonts.googleapis.com/css?family=Roboto\" rel=\"stylesheet\" type=\"text/css\">\n              <link href=\"/public/css/fileMeta.css\" rel=\"stylesheet\" type=\"text/css\">\n           </head>\n        \n           <body>\n        \n              <div class=\"container\">\n                <h2>API Project: File Metadata Microservice</h2>\n                <h3>User Stories:</h3>\n                <ol>\n                  <li>I can submit a form object that includes a file upload.</li>\n                  <li>The from file input field  has the \"name\" attribute set to \"upfile\". We rely on this in testing.</li>\n                  <li>When I submit something, I will receive the file name, and size in bytes within the JSON response.</li>\n                </ol>\n        \n                <h3>Usage:</h3>\n                <p>\n                  Please Upload a File ...\n                </p>\n                <div class=\"view\">\n                  <h4 id=\"output\"></h4>\n                  <form enctype=\"multipart/form-data\" method=\"POST\" action=\"/.netlify/functions/filemeta/api/fileanalyse\">\n                    <input id=\"inputfield\" type=\"file\" name=\"upfile\">\n                    <input id=\"button\" type=\"submit\" value=\"Upload\">\n                  </form>\n                </div>\n              </div>\n              <div class=\"footer\">\n                <p>\n                  By <a href=\"https://www.noicefluid.com/\">Dra. Paiton</a>\n                </p>\n              </div>\n           </body>\n        \n        \n        </html>\n        ");
    res.end();
});
module.exports = app;
module.exports.handler = serverless_http_1.default(app);

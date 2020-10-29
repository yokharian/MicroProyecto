"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = require("dotenv");
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var mongoose_auto_increment_1 = __importDefault(require("mongoose-auto-increment"));
var path_1 = require("path");
var serverless_http_1 = __importDefault(require("serverless-http"));
dotenv_1.config();
var app = express_1.default();
var fileName = 'shortUrl';
var path = '/.netlify/functions/';
//#region configs
/** this project needs a db !! **/
app.use(cors_1.default());
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
mongoose_auto_increment_1.default.initialize(db);
// by Elsner https://regexr.com/
var urlValidation = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
var urlSchema = new mongoose_1.default.Schema({
    url: { type: String, required: true, match: urlValidation },
});
urlSchema.plugin(mongoose_auto_increment_1.default.plugin, { model: 'userUrls', startAt: 100 });
var urlModel = mongoose_1.default.model('userUrls', urlSchema);
// create application/json parser
app.use(body_parser_1.default.urlencoded({ extended: false }));
// create application/x-www-form-urlencoded parser
app.use(body_parser_1.default.json());
// http://expressjs.com/en/starter/static-files.html
app.use('/public', express_1.default.static(path_1.join(__dirname, '../public/')));
var router = express_1.default.Router();
//#endregion configs
var documentToEndpointResponse = function (document) { return ({
    'original_url': document.get('url'),
    'short_url': document.get('_id'),
}); };
router.post('/new/', function (req, res) {
    var url = req.body.url || 'https://noicefluid.com';
    urlModel
        .findOne({ url: url }, function (err, found) {
        if (err)
            console.log(err);
        return found || undefined;
    })
        .then(function (found) {
        if (found)
            res.json(documentToEndpointResponse(found));
        else {
            new urlModel({ url: url })
                .save()
                .then(function (doc) { return res.json(documentToEndpointResponse(doc)); })
                .catch(console.log);
        }
    });
});
// GET
router.use('/:id?', function (req, res) {
    urlModel
        .findById(req.params.id, function (err, data) {
        if (err)
            return console.log(err);
    })
        .then(function (data) {
        if (data)
            res.redirect(data.get('url'));
        else
            res.json({ error: 'No short URL found for the given input' });
    })
        .catch(function (err) { return console.log; });
});
//#region configs
app.use(path + fileName.toLowerCase() + '/api/' + fileName.toLowerCase(), router); // path must route to lambda
// index
app.get(path + fileName.toLowerCase(), function (_, res) {
    res.write("<!DOCTYPE html>\n\n    <html>\n    \n       <head>\n          <title>URL Shortener</title>\n          <link rel=\"shortcut icon\" href=\"https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico\" type=\"image/x-icon\"/>\n          <link href=\"https://fonts.googleapis.com/css?family=Roboto\" rel=\"stylesheet\" type=\"text/css\">\n          <link href=\"/public/css/urlshort.css\" rel=\"stylesheet\" type=\"text/css\">\n       </head>\n    \n       <body>\n          <div class=\"container\">\n            <h2>API Project: URL Shortener Microservice</h2>\n            <h3>User Story: </h3>\n            <ol>\n              <li>I can POST a URL to <code>[project_url]/api/shorturl/new</code> and I will receive a shortened URL in the JSON response.<br>Example : <code>{\"original_url\":\"www.google.com\",\"short_url\":1}</code></li>\n              <li>If I pass an invalid URL that doesn't follow the <code>http(s)://www.example.com(/more/routes)</code> format, the JSON response will contain an error like <code>{\"error\":\"invalid URL\"}</code><br>\n              HINT: to be sure that the submitted url points to a valid site you can use the function <code>dns.lookup(host, cb)</code> from the <code>dns</code> core module.</li>\n              <li>When I visit the shortened URL, it will redirect me to my original link.</li>\n            </ol>\n            \n            <h3>Short URL Creation </h3>\n            <p>\n              example: <code>POST [project_url]/api/shorturl/new</code> - <code>https://www.google.com</code>\n            </p>\n            <form action=\"shorturl/api/shorturl/new\" method=\"POST\">\n              <label for=\"url_input\">URL to be shortened</label>\n              <input id=\"url_input\" type=\"text\" name=\"url\" value=\"https://www.freecodecamp.org\">\n              <input type=\"submit\" value=\"POST URL\">\n            </form>\n            <h3>Example Usage:</h3>\n            <a href=\"https://url-shortener.freecodecamp.repl.co/api/shorturl/3\">\n              [this_project_url]/api/shorturl/3\n            </a>\n          </div>\n          <div class=\"footer\">\n            <p>\n              By <a href=\"https://www.noicefluid.com/\">Dra. Paiton</a>\n            </p>\n          </div>\n       </body>\n    \n    \n    </html>");
    res.end();
});
module.exports = app;
module.exports.handler = serverless_http_1.default(app);
//#endregion

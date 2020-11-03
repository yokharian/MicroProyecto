"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//#region configs
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
var app = express_1.default();
/** this project needs a db !! **/
mongoose_1.default.connect(process.env.DB_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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
var userModel = mongoose_1.default.model('userModel', new mongoose_1.default.Schema({
    username: { type: String, required: true },
    log: { type: Array, required: false, default: [] },
}));
router.post('/new-user', function (req, res) {
    var username = req.body.username || null;
    userModel
        .findOne({ username: username })
        .then(function (found) {
        if (found)
            res.send('Username Already Taken');
        else {
            new userModel({ username: username })
                .save()
                .then(function (doc) {
                return res.json({
                    username: doc.get('username'),
                    _id: doc.get('_id'),
                });
            })
                .catch(function (err) { return console.log('creating model\n\n', err); });
        }
    })
        .catch(function (err) { return console.log('findOne error\n\n', err); });
});
router.post('/add', function (req, res) {
    //#region input handler
    var stringToDateObject = function (str) {
        var _a;
        str = str.toString();
        if (str.match(/(\d{4}\-\d{2}\-\d{2})/)) {
            // utc kind
            return new Date(req.body.date);
        }
        else {
            // unix [0-9]+
            return new Date(parseInt(((_a = str.match(/\d+/g)) === null || _a === void 0 ? void 0 : _a.reduce(function (a, v) { return a + v; })) || ''));
        }
    };
    var userId = req.body.userId;
    var description = req.body.description;
    var duration = req.body.duration;
    // optional
    var date = req.body.date ? stringToDateObject(req.body.date) : new Date();
    if (![userId, description, duration].every(function (v) { return v; }))
        res.json({ error: 'you need userId & description & duration' });
    // fcc says = In our test we will use date strings compliant with ISO-8601 (e.g. "2016-11-20") because this will ensure an UTC timestamp.
    if (req.body.date && !req.body.date.match(/(\d{5,})|(\d{4}\-\d{2}\-\d{2})/))
        return res.json({ 'error': 'Invalid Date' });
    //#endregion
    new Date().toDateString();
    var newLog = {
        description: description,
        duration: parseInt(duration),
        date: date.toDateString(),
    };
    userModel
        .findByIdAndUpdate(userId, { '$push': { 'log': newLog } })
        .then(function (found) {
        if (!found)
            res.json('id Not Found');
        else
            res.json(__assign(__assign({}, newLog), {
                _id: found.get('_id'),
                username: found.get('username'),
            }));
    })
        .catch(function (err) { return console.log("can't update", err); });
});
router.get('/log', function (req, res) {
    //#region args to params
    var userId = typeof req.query.userId == 'string' && req.query.userId;
    var from = typeof req.query.from == 'string' || typeof req.query.from == 'number'
        ? new Date(req.query.from).getTime()
        : new Date(0).getTime();
    var to = typeof req.query.to == 'string' || typeof req.query.to == 'number'
        ? new Date(req.query.to).getTime()
        : new Date().getTime();
    var limit = typeof req.query.limit == 'string' || typeof req.query.limit == 'number'
        ? parseInt(req.query.limit)
        : -1;
    //#endregion
    if (!userId)
        return res.json('empty userId route param');
    var mergeObjectsIfAny = function () {
        var objetos = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objetos[_i] = arguments[_i];
        }
        var acc = {};
        objetos.forEach(function (element) {
            acc = __assign(__assign({}, acc), element);
        });
        return acc;
    };
    var constraints = mergeObjectsIfAny(req.query.from ? { from: req.query.from } : {}, req.query.to ? { to: req.query.to } : {});
    userModel
        .findById(userId)
        .then(function (found) {
        if (!found)
            return res.json('user not found');
        var obtainedLogs = found.get('log').filter(function (v) {
            return (from <= new Date(v.date).getTime() &&
                new Date(v.date).getTime() <= to);
        });
        if (limit != -1)
            obtainedLogs = obtainedLogs.slice(0, limit);
        res.json(mergeObjectsIfAny({
            _id: userId,
            username: found.get('username'),
            count: obtainedLogs.length,
            log: obtainedLogs,
        }, constraints));
    })
        .catch(function (err) { return console.log('findById\n\n', err); });
});
router.get('/users', function (req, res) {
    console.log('get', req.params);
    userModel
        .find()
        .then(function (found) {
        return res.json(found.map(function (user) { return ({
            'username': user.get('username'),
            '_id': user.get('_id'),
        }); }));
    })
        .catch(console.log);
});
router.post('/users', function (req, res) {
    console.log('post', req.body);
});
//#region configs
// // Not found middleware
// router.use((req, res, next) => {
// 	return next({ status: 404, message: 'not found' });
// });
// // Error Handling middleware
// router.use((err, req, res, next) => {
// 	let errCode, errMessage;
// 	if (err.errors) {
// 		// mongoose validation error
// 		errCode = 400; // bad request
// 		const keys = Object.keys(err.errors);
// 		// report the first validation error
// 		errMessage = err.errors[keys[0]].message;
// 	} else {
// 		// generic or custom error
// 		errCode = err.status || 500;
// 		errMessage = err.message || 'Internal Server Error';
// 	}
// 	res.status(errCode).type('txt').send(errMessage);
// });
app.use(path + fileName.toLowerCase() + '/api/' + fileName.toLowerCase(), router); // path must route to lambda
// index
app.get(path + fileName.toLowerCase(), function (_, res) {
    res.write("<!DOCTYPE html>\n\t\t<html>\n\t\t\n\t\t   <head>\n\t\t\t  <title>Exercise Tracker | Free Code Camp</title>\n\t\t\t  <link rel=\"shortcut icon\" href=\"https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico\" type=\"image/x-icon\"/>\n\t\t\t  <link href=\"https://fonts.googleapis.com/css?family=Roboto\" rel=\"stylesheet\" type=\"text/css\">\n\t\t\t  <link href=\"/public/css/exercise.css\" rel=\"stylesheet\" type=\"text/css\">\n\t\t   </head>\n\t\t\n\t\t   <body>\n\t\t\t  <div class=\"container\">\n\t\t\t\t <h1>Exercise tracker</h1>\n\t\t\t\t  <form action=\"/.netlify/functions/exercise/api/exercise/new-user\" method=\"post\">\n\t\t\t\t\t<h3>Create a New User</h3>\n\t\t\t\t\t<p><code>POST /api/exercise/new-user</code></p>\n\t\t\t\t\t<input id=\"uname\" type=\"text\" name=\"username\" placeholder=\"username\">\n\t\t\t\t\t<input type=\"submit\" value=\"Submit\">\n\t\t\t\t  </form>\n\t\t\t\t  <form action=\"/.netlify/functions/exercise/api/exercise/add\" method=\"post\">\n\t\t\t\t\t<h3>Add exercises</h3>\n\t\t\t\t\t<p><code>POST /api/exercise/add</code></p>\n\t\t\t\t\t<input id=\"uid\" type=\"text\" name=\"userId\" placeholder=\"userId*\">\n\t\t\t\t\t<input id=\"desc\" type=\"text\" name=\"description\" placeholder=\"description*\">\n\t\t\t\t\t<input id=\"dur\" type=\"text\" name=\"duration\" placeholder=\"duration* (mins.)\">\n\t\t\t\t\t<input id=\"dat\" type=\"text\" name=\"date\" placeholder=\"date (yyyy-mm-dd)\">\n\t\t\t\t\t<input type=\"submit\" value=\"Submit\">\n\t\t\t\t  </form>\n\t\t\t\t  <p><strong>GET users's exercise log: </strong><code>GET /api/exercise/log?{userId}[&amp;from][&amp;to][&amp;limit]</code></p>\n\t\t\t\t  <p><strong>{ }</strong> = required, <strong>[ ]</strong> = optional</p>\n\t\t\t\t  <p><strong>from, to</strong> = dates (yyyy-mm-dd); <strong>limit</strong> = number</p>\n\t\t\t  </div>\n\t\t\t  <div class=\"footer\">\n\t\t\t\t <p>\n\t\t\t\t   By <a href=\"https://www.noicefluid.com/\">Dra. Paiton</a>\n\t\t\t\t </p>\n\t\t\t   </div>\n\t\t   </body>\n\t\t\n\t\t</html>\n\t\t");
    res.end();
});
module.exports = app;
module.exports.handler = serverless_http_1.default(app);
//#endregion

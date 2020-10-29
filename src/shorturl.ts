import bodyParser from 'body-parser';
import cors from 'cors';
import { config as dotEnvConfig } from 'dotenv';
import Express, { query } from 'express';
import Mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { join } from 'path';
import serverless from 'serverless-http';
dotEnvConfig();
var app = Express();
const fileName = 'shortUrl';
const path = '/.netlify/functions/';

//#region configs
/** this project needs a db !! **/
app.use(cors());

Mongoose.connect(process.env.DB_URI || '', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

var db = Mongoose.connection;

db.on('error', function (err) {
	console.log('connection error', err);
});

db.once('open', function () {
	console.log('Connection to DB successful');
});

autoIncrement.initialize(db);

// by Elsner https://regexr.com/
const urlValidation = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

const urlSchema = new Mongoose.Schema({
	url: { type: String, required: true, match: urlValidation },
});
urlSchema.plugin(autoIncrement.plugin, { model: 'userUrls', startAt: 100 });
const urlModel = Mongoose.model('userUrls', urlSchema);

// create application/json parser
app.use(bodyParser.urlencoded({ extended: false }));

// create application/x-www-form-urlencoded parser
app.use(bodyParser.json());

// http://expressjs.com/en/starter/static-files.html
app.use('/public', Express.static(join(__dirname, '../public/')));

const router = Express.Router();
//#endregion configs

const documentToEndpointResponse = document => ({
	'original_url': document.get('url'),
	'short_url': document.get('_id'),
});

router.post('/new/', (req, res) => {
	const url: string = req.body.url || 'https://noicefluid.com';

	urlModel
		.findOne({ url: url }, (err, found) => {
			if (err) console.log(err);
			return found || undefined;
		})
		.then(found => {
			if (found) res.json(documentToEndpointResponse(found));
			else {
				new urlModel({ url: url })
					.save()
					.then(doc => res.json(documentToEndpointResponse(doc)))
					.catch(console.log);
			}
		});
});

// GET
router.use('/:id?', (req, res) => {
	urlModel
		.findById(req.params.id, (err, data) => {
			if (err) return console.log(err);
		})
		.then(data => {
			if (data) res.redirect(data.get('url'));
			else res.json({ error: 'No short URL found for the given input' });
		})
		.catch(err => console.log);
});

//#region configs
app.use(
	path + fileName.toLowerCase() + '/api/' + fileName.toLowerCase(),
	router,
); // path must route to lambda

// index
app.get(path + fileName.toLowerCase(), (_, res) => {
	res.write(
		`<!DOCTYPE html>

    <html>
    
       <head>
          <title>URL Shortener</title>
          <link rel="shortcut icon" href="https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico" type="image/x-icon"/>
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
          <link href="/public/css/urlshort.css" rel="stylesheet" type="text/css">
       </head>
    
       <body>
          <div class="container">
            <h2>API Project: URL Shortener Microservice</h2>
            <h3>User Story: </h3>
            <ol>
              <li>I can POST a URL to <code>[project_url]/api/shorturl/new</code> and I will receive a shortened URL in the JSON response.<br>Example : <code>{"original_url":"www.google.com","short_url":1}</code></li>
              <li>If I pass an invalid URL that doesn't follow the <code>http(s)://www.example.com(/more/routes)</code> format, the JSON response will contain an error like <code>{"error":"invalid URL"}</code><br>
              HINT: to be sure that the submitted url points to a valid site you can use the function <code>dns.lookup(host, cb)</code> from the <code>dns</code> core module.</li>
              <li>When I visit the shortened URL, it will redirect me to my original link.</li>
            </ol>
            
            <h3>Short URL Creation </h3>
            <p>
              example: <code>POST [project_url]/api/shorturl/new</code> - <code>https://www.google.com</code>
            </p>
            <form action="api/shorturl/new" method="POST">
              <label for="url_input">URL to be shortened</label>
              <input id="url_input" type="text" name="url" value="https://www.freecodecamp.org">
              <input type="submit" value="POST URL">
            </form>
            <h3>Example Usage:</h3>
            <a href="https://url-shortener.freecodecamp.repl.co/api/shorturl/3">
              [this_project_url]/api/shorturl/3
            </a>
          </div>
          <div class="footer">
            <p>
              By <a href="https://www.noicefluid.com/">Dra. Paiton</a>
            </p>
          </div>
       </body>
    
    
    </html>`,
	);
	res.end();
});

module.exports = app;
module.exports.handler = serverless(app);
//#endregion

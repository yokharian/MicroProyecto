import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';
const fileName = 'timeStamp';
const path = '/.netlify/functions/';

const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use('/public', express.static(join(__dirname, '../public/')));

const router = express.Router();

router.get('/:date_string?', (req, res) => {
	var reqDate = new Date(req.params.date_string);
	var responseDate = !isNaN(reqDate.getTime()) ? reqDate : new Date();

	var response = {
		unix: responseDate.getTime(),
		utc: responseDate.toUTCString(),
	};
	return res.json(response);
});

app.use(
	path + fileName.toLowerCase() + '/api' + fileName.toLowerCase(),
	router,
); // path must route to lambda

// index
app.get(path + fileName.toLowerCase(), (_, res) => {
	res.write(
		`<!DOCTYPE html>

		<html>
		
		   <head>
			  <title>Timestamp Microservice</title>
			  <link rel="shortcut icon" href="https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico" type="image/x-icon"/>
			  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
			  <link href="/public/css/timestamp.css" rel="stylesheet" type="text/css">
		   </head>
		
		   <body>
		
			  <div class="container">
				<h2>API Project: Timestamp Microservice</h2>
				<h3>User Stories:</h3>
				<ol class="user-stories">
				  
				  <li>The API endpoint is <code>GET [project_url]/api/timestamp/:date_string?</code></li>
				  <li>A date string is valid if can be successfully parsed by <code>new Date(date_string)</code>.<br>
				  Note that the unix timestamp needs to be an <strong>integer</strong> (not a string) specifying <strong>milliseconds</strong>.<br> 
				  In our test we will use date strings compliant with ISO-8601 (e.g. <code>"2016-11-20"</code>) because this will ensure an UTC timestamp.</li>
				  <li>If the date string is <strong>empty</strong> it should be equivalent to trigger <code>new Date()</code>, i.e. the service uses the current timestamp.</li>
				  <li>If the date string is <strong>valid</strong> the api returns a JSON having the structure<br><code>{"unix": &lt;date.getTime()&gt;, "utc" : &lt;date.toUTCString()&gt; }</code><br>
					e.g. <code>{"unix": 1479663089000 ,"utc": "Sun, 20 Nov 2016 17:31:29 GMT"}</code></li>
				  <li>If the date string is <strong>invalid</strong> the api returns a JSON having the structure <br>
					  <code>{"error" : "Invalid Date" }</code>.
				  </li>
				</ol>
		
				<h3>Example Usage:</h3>
				<ul>
				  <li><a href="api/timestamp/2015-12-25">[project url]/api/timestamp/2015-12-25</a></li>
				  <li><a href="api/timestamp/1451001600000">[project url]/api/timestamp/1451001600000</a></li>
				</ul>
		
				<h3>Example Output:</h3>
				<p>
				  <code>{"unix":1451001600000, "utc":"Fri, 25 Dec 2015 00:00:00 GMT"}</code>
				</p>
			  </div>
			  <div class="footer">
				<p>
				  By <a href="https://www.freecodecamp.org/">freeCodeCamp</a>
				</p>
			  </div>
		   </body>
		
		</html>
		`,
	);
	res.end();
});

module.exports = app;
module.exports.handler = serverless(app);

import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';
const fileName = 'headparser';
const path = '/.netlify/functions/';

const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use('/public', express.static(join(__dirname, '../public/')));

const router = express.Router();

router.get('/whoami', (req, res) => {
	res.json({
		ipaddress: req.headers['host'],
		language: req.headers['accept-language'],
		software: req.headers['user-agent'],
	});
});

app.use(path + fileName.toLowerCase() + '/api', router); // path must route to lambda
app.get(path + fileName.toLowerCase(), (_, res) => {
	res.write(
		`<!DOCTYPE html>

    <html>
    
       <head>
          <title>Request Header Parser</title>
          <link rel="shortcut icon" href="https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico" type="image/x-icon"/>
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
          <link href="/public/css/headParser.css" rel="stylesheet" type="text/css">
       </head>
    
       <body>
          <div class="container">
            <h2>Request Header Parser Microservice</h2>
    
            <h3>Example Usage:</h3>
            <p>
              [base url]/api/whoami
            </p>
    
            <h3>Example Output:</h3>
            <p>
              <code>{"ipaddress":"::ffff:159.20.14.100","language":"en-US,en;q=0.5",<br>"software":"Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"}</code>
            </p>
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

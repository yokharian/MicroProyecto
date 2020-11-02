import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';
import bodyParser from 'body-parser';
const fileName = 'filemeta';
const path = '/.netlify/functions/';
var multer = require('multer');
var upload = multer();
const app = express();

// create application/json parser
app.use(bodyParser.urlencoded({ extended: false }));
// create application/x-www-form-urlencoded parser
app.use(bodyParser.json());
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
// http://expressjs.com/en/starter/static-files.html
app.use('/public', express.static(join(__dirname, '../public/')));
const router = express.Router();

router.post('/fileanalyse', upload.single('upfile'), (req, res, next) => {
	const file = req.file;
	if (!file) {
		const error = new Error('Please upload a file');
		error.httpStatusCode = 400;
		return next(error);
	}
	res.json({ name: file.originalname, type: file.mimetype, size: file.size });
});

app.use(path + fileName.toLowerCase() + '/api', router); // path must route to lambda
app.use(path + fileName.toLowerCase(), (_, res) => {
	res.write(
		`<!DOCTYPE html>

        <html>
        
           <head>
              <title>File Metadata</title>
              <link rel="shortcut icon" href="https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico" type="image/x-icon"/>
              <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
              <link href="/public/css/fileMeta.css" rel="stylesheet" type="text/css">
           </head>
        
           <body>
        
              <div class="container">
                <h2>API Project: File Metadata Microservice</h2>
                <h3>User Stories:</h3>
                <ol>
                  <li>I can submit a form object that includes a file upload.</li>
                  <li>The from file input field  has the "name" attribute set to "upfile". We rely on this in testing.</li>
                  <li>When I submit something, I will receive the file name, and size in bytes within the JSON response.</li>
                </ol>
        
                <h3>Usage:</h3>
                <p>
                  Please Upload a File ...
                </p>
                <div class="view">
                  <h4 id="output"></h4>
                  <form enctype="multipart/form-data" method="POST" action="/.netlify/functions/filemeta/api/fileanalyse">
                    <input id="inputfield" type="file" name="upfile">
                    <input id="button" type="submit" value="Upload">
                  </form>
                </div>
              </div>
              <div class="footer">
                <p>
                  By <a href="https://www.noicefluid.com/">Dra. Paiton</a>
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

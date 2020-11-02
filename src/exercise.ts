import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import Mongoose from 'mongoose';
import { config as dotEnvConfig } from 'dotenv';
import Express from 'express';
import cors from 'cors';
import { join } from 'path';
dotEnvConfig();
const path = '/.netlify/functions/';
const fileName = 'exercise';

//#region configs
const app = Express();
/** this project needs a db !! **/
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

// create application/json parser
app.use(bodyParser.urlencoded({ extended: false }));
// create application/x-www-form-urlencoded parser
app.use(bodyParser.json());
// http://expressjs.com/en/starter/static-files.html
app.use('/public', Express.static(join(__dirname, '../public/')));
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

const router = Express.Router();
//#endregion configs

// Not found middleware
router.use((req, res, next) => {
	return next({ status: 404, message: 'not found' });
});

// Error Handling middleware
router.use((err, req, res, next) => {
	let errCode, errMessage;

	if (err.errors) {
		// mongoose validation error
		errCode = 400; // bad request
		const keys = Object.keys(err.errors);
		// report the first validation error
		errMessage = err.errors[keys[0]].message;
	} else {
		// generic or custom error
		errCode = err.status || 500;
		errMessage = err.message || 'Internal Server Error';
	}
	res.status(errCode).type('txt').send(errMessage);
});

router.get('/log');

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
			  <title>Exercise Tracker | Free Code Camp</title>
			  <link rel="shortcut icon" href="https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico" type="image/x-icon"/>
			  <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
			  <link href="/public/css/tracker.css" rel="stylesheet" type="text/css">
		   </head>
		
		   <body>
			  <div class="container">
				 <h1>Exercise tracker</h1>
				  <form action="tracker/api/exercise/new-user" method="post">
					<h3>Create a New User</h3>
					<p><code>POST /api/exercise/new-user</code></p>
					<input id="uname" type="text" name="username" placeholder="username">
					<input type="submit" value="Submit">
				  </form>
				  <form action="tracker/api/exercise/add" method="post">
					<h3>Add exercises</h3>
					<p><code>POST /api/exercise/add</code></p>
					<input id="uid" type="text" name="userId" placeholder="userId*">
					<input id="desc" type="text" name="description" placeholder="description*">
					<input id="dur" type="text" name="duration" placeholder="duration* (mins.)">
					<input id="dat" type="text" name="date" placeholder="date (yyyy-mm-dd)">
					<input type="submit" value="Submit">
				  </form>
				  <p><strong>GET users's exercise log: </strong><code>GET /api/exercise/log?{userId}[&amp;from][&amp;to][&amp;limit]</code></p>
				  <p><strong>{ }</strong> = required, <strong>[ ]</strong> = optional</p>
				  <p><strong>from, to</strong> = dates (yyyy-mm-dd); <strong>limit</strong> = number</p>
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
//#endregion

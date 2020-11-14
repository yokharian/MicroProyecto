//#region configs
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
const app = Express();

/** this project needs a db !! **/
Mongoose.connect(process.env.DB_URI || '', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
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

const userModel = Mongoose.model(
	'userModel',
	new Mongoose.Schema({
		username: { type: String, required: true },
		log: { type: Array, required: false, default: [] },
	}),
);

router.post('/new-user', (req, res) => {
	const username = req.body.username || null;
	userModel
		.findOne({ username: username })
		.then(found => {
			if (found) res.send('Username Already Taken');
			else {
				new userModel({ username: username })
					.save()
					.then(doc =>
						res.json({
							username: doc.get('username'),
							_id: doc.get('_id'),
						}),
					)
					.catch(err => console.log('creating model\n\n', err));
			}
		})
		.catch(err => console.log('findOne error\n\n', err));
});

router.post('/add', (req, res) => {
	//#region input handler
	const stringToDateObject = str => {
		str = str.toString();
		if (str.match(/(\d{4}\-\d{2}\-\d{2})/)) {
			// utc kind
			return new Date(req.body.date);
		} else {
			// unix [0-9]+
			return new Date(
				parseInt(str.match(/\d+/g)?.reduce((a, v) => a + v) || ''),
			);
		}
	};
	const userId = req.body._id;
	const description = req.body.description;
	const duration = req.body.duration;
	// optional
	const date = req.body.date ? stringToDateObject(req.body.date) : new Date();

	if (![userId, description, duration].every(v => v))
		res.json({ error: 'you need userId & description & duration' });
	// fcc says = In our test we will use date strings compliant with ISO-8601 (e.g. "2016-11-20") because this will ensure an UTC timestamp.
	if (req.body.date && !req.body.date.match(/(\d{5,})|(\d{4}\-\d{2}\-\d{2})/))
		return res.json({ 'error': 'Invalid Date' });
	//#endregion
	new Date().toDateString();
	const newLog = {
		description: description,
		duration: parseInt(duration),
		date: date.toDateString(),
	};

	userModel
		.findByIdAndUpdate(userId, { '$push': { 'log': newLog } })
		.then(found => {
			if (!found) res.json('id Not Found');
			else
				res.json({
					...newLog,
					...{
						_id: found.get('_id'),
						username: found.get('username'),
					},
				});
		})
		.catch(err => console.log("can't update", err));
});

router.get('/log', (req, res) => {
	//#region args to params
	const userId = req.query._id as string;

	const from =
		typeof req.query.from == 'string' || typeof req.query.from == 'number'
			? new Date(req.query.from).getTime()
			: new Date(0).getTime();

	const to =
		typeof req.query.to == 'string' || typeof req.query.to == 'number'
			? new Date(req.query.to).getTime()
			: new Date().getTime();

	const limit =
		typeof req.query.limit == 'string' || typeof req.query.limit == 'number'
			? parseInt(req.query.limit)
			: -1;
	//#endregion

	if (!userId) return res.json('empty _id route param');

	const mergeObjectsIfAny = (...objetos) => {
		let acc = {};
		objetos.forEach(element => {
			acc = { ...acc, ...element };
		});
		return acc;
	};

	const constraints = mergeObjectsIfAny(
		req.query.from ? { from: req.query.from } : {},
		req.query.to ? { to: req.query.to } : {},
	);
	userModel
		.findById(userId)
		.then(found => {
			if (!found) return res.json('user not found');

			let obtainedLogs = found.get('log').filter(v => {
				return (
					from <= new Date(v.date).getTime() &&
					new Date(v.date).getTime() <= to
				);
			});
			if (limit != -1) obtainedLogs = obtainedLogs.slice(0, limit);

			res.json(
				mergeObjectsIfAny(
					{
						_id: userId,
						username: found.get('username'),
						count: obtainedLogs.length,
						log: obtainedLogs,
					},
					constraints,
				),
			);
		})
		.catch(err => console.log('findById\n\n', err));
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
			  <link href="/public/css/exercise.css" rel="stylesheet" type="text/css">
		   </head>
		
		   <body>
			  <div class="container">
				 <h1>Exercise tracker</h1>
				  <form action="/.netlify/functions/exercise/api/exercise/new-user" method="post">
					<h3>Create a New User</h3>
					<p><code>POST /api/exercise/new-user</code></p>
					<input id="uname" type="text" name="username" placeholder="username">
					<input type="submit" value="Submit">
				  </form>
				  <form action="/.netlify/functions/exercise/api/exercise/add" method="post">
					<h3>Add exercises</h3>
					<p><code>POST /api/exercise/add</code></p>
					<input id="uid" type="text" name="_id" placeholder="_id*">
					<input id="desc" type="text" name="description" placeholder="description*">
					<input id="dur" type="text" name="duration" placeholder="duration* (mins.)">
					<input id="dat" type="text" name="date" placeholder="date (yyyy-mm-dd)">
					<input type="submit" value="Submit">
				  </form>
				  <p><strong>GET users's exercise log: </strong><code>GET /api/exercise/log?{_id}[&amp;from][&amp;to][&amp;limit]</code></p>
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

import serverless from 'serverless-http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

const path = '/.netlify/functions/';
const fileName = 'tracker';

mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

// Not found middleware
app.use((req, res, next) => {
	return next({ status: 404, message: 'not found' });
});

// Error Handling middleware
app.use((err, req, res, next) => {
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

module.exports = app;
module.exports.handler = serverless(app);

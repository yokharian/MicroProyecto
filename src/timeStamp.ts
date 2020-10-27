import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';

const path = '/.netlify/functions/server/';
const apiName = 'timestamp';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(join(__dirname, '../public/')));
console.log('Starting headParser.js');

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

router.get('/', (req, res) => {
	res.send('hello world from timestamp');
});

app.use(path + apiName, router);

module.exports = app;
module.exports.handler = serverless(app);

import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';
const apiName = 'TimeStamp';
const path = '/.netlify/functions/';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

router.get('/api/:date_string?', (req, res) => {
	var reqDate = new Date(req.params.date_string);
	var responseDate = !isNaN(reqDate.getTime()) ? reqDate : new Date();

	var response = {
		unix: responseDate.getTime(),
		utc: responseDate.toUTCString(),
	};
	return res.json(response);
});

router.get('/', (_, res) =>
	res.sendFile(join(__dirname + '../public/html/timeStamp.html')),
);

app.use(path + apiName.toLowerCase(), router); // path must route to lambda
module.exports = app;
module.exports.handler = serverless(app);

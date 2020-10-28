import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';
const apiName = 'TimeStamp';
const path = '/.netlify/functions/';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

app.use('/public', express.static(join(__dirname, '../public/')));

router.get('/', (_, res) =>
	res.sendFile(join(__dirname + '../public/html/headParser.html')),
);

app.use(path + apiName.toLowerCase(), router); // path must route to lambda
module.exports = app;
module.exports.handler = serverless(app);

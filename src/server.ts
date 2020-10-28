import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';
const fileName = 'server';
const path = '/.netlify/functions/';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

app.use('/public', express.static(join(__dirname, '../public/')));

router.get('/', (_, res) =>
	res.sendFile(join(__dirname + '../public/html/index.html')),
);
router.get('/appii', (_, res) =>
	res.sendFile(join(__dirname + '../public/html/index.html')),
);

app.use(path + fileName.toLowerCase(), router); // path must route to lambda
module.exports = app;
module.exports.handler = serverless(app);

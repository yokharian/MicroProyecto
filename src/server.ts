import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';
const app = express();

console.log('Starting Server.js');

require('./routes/').default({
	app: app,
	path: '/.netlify/functions/server/',
	exclude: '(deprecated)|(timeStamp)|(tracker)|(urlshort)|(fileMeta)',
});

app.use('/public', express.static(join(__dirname, '../public/')));

app.use('/', (_, res) => res.sendFile(join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);

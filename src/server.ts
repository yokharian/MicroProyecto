import express from 'express';
import serverless from 'serverless-http';

const app = express();

console.log('Starting Server.js');

require('./routes/').default({
	app: app,
	path: '/.netlify/functions/server/',
	exclude: '(deprecated)|(timeStamp)|(tracker)|(urlshort)|(fileMeta)',
});

app.use(
	'/public',
	express.static(require('path').join(__dirname, '../public/')),
);

module.exports = app;
module.exports.handler = serverless(app);

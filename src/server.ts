import express from 'express';
import serverless from 'serverless-http';

import { join } from 'path';

import apis from './routes';

const app = express();
console.log('Starting Server.js');
console.log(__dirname);
console.log(require('fs').readdirSync(join(__dirname, 'opt')));
console.log(require('fs').readdirSync(join(__dirname, 'opt', 'build')));
console.log(require('fs').readdirSync(join(__dirname, 'opt', 'build', 'repo')));

const path = '/.netlify/functions/server/';

console.log(apis);
Object.entries(apis).forEach(api => {
	let apiName = api[0].toLowerCase();
	let router = api[1](app);
	app.use(join(path, apiName), router);
});

app.use('/public', express.static(join(__dirname, '../public/')));

app.use('/', (_, res) => res.sendFile(join(__dirname, '../index.html')));
module.exports = app;
module.exports.handler = serverless(app);

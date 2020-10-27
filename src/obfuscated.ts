// NETLIFY ADAPTATION /////////////
import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';

const app = express();
console.log('Starting Server.js');

const listaDeRoutes = {
	headParser: function (app) {
		const { join } = require('path');
		const publicHtml = join(__dirname, '../../public/html');

		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));

		const router = express.Router();

		router.get('/', (_, res) =>
			res.sendFile(join(publicHtml, 'headParser.html')),
		);
		router.get('/hola', (_, res) => res.json({ 'hola': 'hola' }));

		return router;
	},
	// timeStamp: function (app) {
	// 	const router = express.Router();

	// 	return router;
	// },
};

Object.entries(listaDeRoutes).forEach(api => {
	var path = '/.netlify/functions/server/';
	let apiName = api[0].toLowerCase();
	let router = api[1](app);
	app.use(path + apiName, router);
});

console.log(
	'LOADED',
	Object.keys(listaDeRoutes).map(v => v.toLowerCase()),
);

app.use('/public', express.static(join(__dirname, '../public/')));

app.use('/', (_, res) => res.sendFile(join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);

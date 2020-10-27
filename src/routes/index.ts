exports.default = function ({ app, path = '/', exclude = '' }) {
	const { join } = require('path');

	const listaDeRoutes = require('fs')
		.readdirSync(__dirname)
		.filter(v => !v.match(/index/))
		.filter(v => !v.match(new RegExp(exclude, 'gi')));

	console.log('LOADED', listaDeRoutes);

	listaDeRoutes.forEach((api: string) => {
		let router = require(join(__dirname, api)).default(app);
		let apiName = api.slice(0, api.length - 3).toLowerCase();
		app.use(path + apiName, router);
	});

	// app.use(path, (_, res) => {
	// 	res.writeHead(200, { 'Content-Type': 'text/html' });
	// 	res.write('<h1>Hello from Express.js!</h1>');
	// 	res.end();
	// });
};

console.clear();

import express from 'express';
import { join } from 'path';
if (!process.env.netlify || true) {
	const app = express();

	console.log('Starting Server.js');

	require('./routes/').default({
		app: app,
		path: '/.netlify/functions/server/',
		exclude: '(deprecated)|(timeStamp)|(tracker)|(urlshort)|(fileMeta)',
	});

	app.use('/public', express.static(join(__dirname, '../public/')));

	app.use('/', (_, res) => res.sendFile(join(__dirname, '../index.html')));

	console.log('LOCAL_MODE=true');

	app.listen(3000, () => console.log('Local app listening on port 3000!'));
}

import express from 'express';

export default app => {
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
};

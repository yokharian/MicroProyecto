import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';
const fileName = 'server';
const path = '/.netlify/functions/';

const app = express();
app.use('/public', express.static(join(__dirname, '../public/')));

app.get(path + fileName.toLowerCase(), (_, res) => {
	res.write(
		`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        server
    </body>
    </html>`,
	);
	res.end();
});
module.exports = app;
module.exports.handler = serverless(app);

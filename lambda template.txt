import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';
const fileName = 'server';
const path = '/.netlify/functions/';

const app = express();
app.use('/public', express.static(join(__dirname, '../public/')));
app.use(path + fileName.toLowerCase(), (_, res) => {
	res.write(
		`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        hello
    </body>
    </html>`,
	);
	res.end();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

app.use(path + fileName.toLowerCase() + '/api', router); // path must route to lambda
module.exports = app;
module.exports.handler = serverless(app);

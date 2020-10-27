import express from 'express';
import serverless from 'serverless-http';
import { join } from 'path';

const path = '/.netlify/functions/server/';
const apiName = 'headparser';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(join(__dirname, '../public/')));
console.log('Starting headParser.js');

const router = express.Router();

router.get('/', (_, res) => res.json({ 'hola': 'hola' }));

app.use(path, router);

module.exports = app;
module.exports.handler = serverless(app);

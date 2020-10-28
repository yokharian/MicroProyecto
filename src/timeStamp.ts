import express from 'express';
import serverless from 'serverless-http';
import { dirname, join } from 'path';
const apiName = 'TimeStamp';
const path = '/.netlify/functions/';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const router = express.Router();

router.get('/api/:date_string?', (req, res) => {
	var reqDate = new Date(req.params.date_string);
	var responseDate = !isNaN(reqDate.getTime()) ? reqDate : new Date();

	var response = {
		unix: responseDate.getTime(),
		utc: responseDate.toUTCString(),
	};
	return res.json(response);
});

router.get('/', (_, res) => {
	var fs = require('fs');
	var path = __dirname;

	recursiveloop(path, function (err, result) {
		/* begin processing of each result */
		// For each file in the array
		for (let i = 0; i < result.length; i++) {
			//Write the name of the file
			console.log('Processing: ' + result[i]);
			//Read the file
			fs.readFile(result[i], 'utf8', function (err, data) {
				//If there is an error notify to the console
				if (err) console.log('Error: ' + err);
				//Parse the json object
				var obj = JSON.parse(data);
				//Print out contents
				console.log('Name: ' + obj.name);
				console.log('Position: ' + obj.position);
			});
		}
	});

	function recursiveloop(dir, done) {
		var results = [];
		fs.readdir(dir, function (err, list) {
			if (err) return done(err);
			var i = 0;
			(function next() {
				var file = list[i++];
				if (!file) return done(null, results);
				file = dir + '/' + file;
				fs.stat(file, function (err, stat) {
					if (stat && stat.isDirectory()) {
						recursiveloop(file, function (err, res) {
							results = results.concat(res);
							next();
						});
					} else {
						results.push(file);
						next();
					}
				});
			})();
		});
	}

	res.sendFile(join(__dirname, '../public/html/timeStamp.html'));
});

app.use(path + apiName.toLowerCase(), router); // path must route to lambda
module.exports = app;
module.exports.handler = serverless(app);

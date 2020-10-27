import express from "express";
const serverless = require('serverless-http')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let timeStamp = express.Router()

timeStamp.get(
	"/:date_string?",
	(
		req: { params: { date_string: string | number | Date } },
		res: { json: (arg0: { unix: number; utc: string }) => any }
	) => {
		var reqDate = new Date(req.params.date_string);
		var responseDate = !isNaN(reqDate.getTime()) ? reqDate : new Date();

		var response = {
			unix: responseDate.getTime(),
			utc: responseDate.toUTCString(),
		};
		return res.json(response);
	}
);

app.use("/.netlify/functions/timestamp", timeStamp)


module.exports.handler = serverless(app)
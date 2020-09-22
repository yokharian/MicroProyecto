import express from "express";
const serverless = require('serverless-http')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let headParser = express.Router()

headParser.get("/",(req,res) => {
    return res.json({"hola":"hola"}
    );}
);

app.use("/.netlify/functions/headparser", headParser)

module.exports.handler = serverless(app)
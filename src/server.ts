import express from "express";

const server = express();

// Express server configuration
server.get("/", (_, res) => {
	res.send("Hello World!");
});

export default server;

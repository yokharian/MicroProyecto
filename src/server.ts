import express from "express";

// Express server configuration
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (_, res) => {
	return res.send("Hello World!");
});

export default server;

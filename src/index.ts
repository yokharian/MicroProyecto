import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import server from "./server";

// manage api ROUTES
import { setup } from "./api/timeStamp";
setup(server);

import { __PORT__ } from "./constantes";
// Starting Express server on a port defined by enviroment var
server.listen(__PORT__, () =>
	console.log(`Server stated! Listening at http://<URL>:${__PORT__}`)
);

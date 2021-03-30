require.extensions['.css'] = () => undefined;
require.extensions['.scss'] = () => undefined;

import "array-flat-polyfill";
import * as fs from "fs";
import Server from "./server";
import { DefaultServerConfig, ServerConfig } from "./server-config";

let serverConfig: ServerConfig = DefaultServerConfig;

if (fs.existsSync('./config.json'))
{
    const loadedConfigJson = fs.readFileSync('./config.json').toString();
    const loadedConfig: Partial<ServerConfig> = JSON.parse(loadedConfigJson);
    serverConfig = { ...serverConfig, ...loadedConfig };
}

const server = new Server(serverConfig);
server.loadFromData();
server.setupServerRoutes();
server.runServer();

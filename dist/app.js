"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("./config/client");
const system_1 = require("./handlers/system");
const message_1 = require("./handlers/message");
// Register handlers
(0, system_1.registerSystemHandlers)(client_1.client);
(0, message_1.registerMessageHandlers)(client_1.client);
// Initialize client
client_1.client.initialize();

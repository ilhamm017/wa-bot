"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSystemHandlers = void 0;
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const registerSystemHandlers = (client) => {
    client.on('qr', (qr) => {
        qrcode_terminal_1.default.generate(qr, {
            small: true
        });
    });
    client.on('authenticated', () => {
        console.log('Authenticated!');
    });
    client.on('auth_failure', (msg) => {
        console.log('Authentication failed!', msg);
    });
    client.on('ready', () => {
        console.log('Client is ready!');
    });
};
exports.registerSystemHandlers = registerSystemHandlers;

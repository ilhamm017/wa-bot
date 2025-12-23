"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const whatsapp_web_js_1 = require("whatsapp-web.js");
exports.client = new whatsapp_web_js_1.Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    authStrategy: new whatsapp_web_js_1.LocalAuth()
});

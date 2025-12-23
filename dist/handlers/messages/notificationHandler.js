"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotificationMessage = void 0;
const whatsapp_web_js_1 = require("whatsapp-web.js");
const handleNotificationMessage = (message) => {
    switch (message.type) {
        case whatsapp_web_js_1.MessageTypes.REVOKED:
            console.log('Revoke message received');
            break;
        case whatsapp_web_js_1.MessageTypes.GROUP_INVITE:
            console.log('Group invite message received');
            break;
        case whatsapp_web_js_1.MessageTypes.LIST:
            console.log('List message received');
            break;
        case whatsapp_web_js_1.MessageTypes.LIST_RESPONSE:
            console.log('List response message received');
            break;
        case whatsapp_web_js_1.MessageTypes.BUTTONS_RESPONSE:
            console.log('Button response message received');
            break;
        case whatsapp_web_js_1.MessageTypes.PAYMENT:
            console.log('Payment message received');
            break;
        case whatsapp_web_js_1.MessageTypes.BROADCAST_NOTIFICATION:
            console.log('Broadcast notification message received');
            break;
        case whatsapp_web_js_1.MessageTypes.CALL_LOG:
            console.log('Call log message received');
            break;
        case whatsapp_web_js_1.MessageTypes.CIPHERTEXT:
            console.log('Ciphertext message received');
            break;
        case whatsapp_web_js_1.MessageTypes.DEBUG:
            console.log('Debug message received');
            break;
        case whatsapp_web_js_1.MessageTypes.E2E_NOTIFICATION:
            console.log('E2E notification message received');
            break;
        case whatsapp_web_js_1.MessageTypes.GP2:
            console.log('Group message received');
            break;
        case whatsapp_web_js_1.MessageTypes.GROUP_NOTIFICATION:
            console.log('Group notification message received');
            break;
        case whatsapp_web_js_1.MessageTypes.HSM:
            console.log('HSM message received');
            break;
        case whatsapp_web_js_1.MessageTypes.INTERACTIVE:
            console.log('Interactive message received');
            break;
        case whatsapp_web_js_1.MessageTypes.NATIVE_FLOW:
            console.log('Native flow message received');
            break;
        case whatsapp_web_js_1.MessageTypes.NOTIFICATION:
            console.log('Notification message received');
            break;
        case whatsapp_web_js_1.MessageTypes.NOTIFICATION_TEMPLATE:
            console.log('Notification template message received');
            break;
        case whatsapp_web_js_1.MessageTypes.OVERSIZED:
            console.log('Oversize message received');
            break;
        case whatsapp_web_js_1.MessageTypes.PROTOCOL:
            console.log('Protocol message received');
            break;
        case whatsapp_web_js_1.MessageTypes.REACTION:
            console.log('Reaction message received');
            break;
        case whatsapp_web_js_1.MessageTypes.TEMPLATE_BUTTON_REPLY:
            console.log('Template button reply message received');
            break;
        case whatsapp_web_js_1.MessageTypes.POLL_CREATION:
            console.log('Poll creation message received');
            break;
        default:
            console.log(`Notification/Other message type received: ${message.type}`);
            break;
    }
};
exports.handleNotificationMessage = handleNotificationMessage;

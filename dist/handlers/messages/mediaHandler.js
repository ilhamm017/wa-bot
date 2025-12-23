"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMediaMessage = void 0;
const whatsapp_web_js_1 = require("whatsapp-web.js");
const handleMediaMessage = (message) => {
    switch (message.type) {
        case whatsapp_web_js_1.MessageTypes.AUDIO:
            console.log('Audio message received');
            break;
        case whatsapp_web_js_1.MessageTypes.VOICE:
            console.log('Voice message received');
            break;
        case whatsapp_web_js_1.MessageTypes.IMAGE:
            console.log('Image message received');
            break;
        case whatsapp_web_js_1.MessageTypes.VIDEO:
            console.log('Video message received');
            break;
        case whatsapp_web_js_1.MessageTypes.DOCUMENT:
            console.log('Document message received');
            break;
        case whatsapp_web_js_1.MessageTypes.STICKER:
            console.log('Sticker message received');
            break;
        case whatsapp_web_js_1.MessageTypes.LOCATION:
            console.log('Location message received');
            break;
        case whatsapp_web_js_1.MessageTypes.CONTACT_CARD:
            console.log('Contact card message received');
            break;
        case whatsapp_web_js_1.MessageTypes.CONTACT_CARD_MULTI:
            console.log('Contact card multi message received');
            break;
        case whatsapp_web_js_1.MessageTypes.ORDER:
            console.log('Order message received');
            break;
        case whatsapp_web_js_1.MessageTypes.PRODUCT:
            console.log('Product message received');
            break;
        default:
            console.log(`Media/Other message type received: ${message.type}`);
            break;
    }
};
exports.handleMediaMessage = handleMediaMessage;

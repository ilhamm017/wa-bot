"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMessageHandlers = void 0;
const whatsapp_web_js_1 = require("whatsapp-web.js");
const queue_1 = require("../services/queue");
const textHandler_1 = require("./messages/textHandler");
const mediaHandler_1 = require("./messages/mediaHandler");
const notificationHandler_1 = require("./messages/notificationHandler");
const allowlist_1 = require("../services/allowlist");
const registerMessageHandlers = (client) => {
    client.on('message_create', async (message) => {
        try {
            if (message.fromMe) {
                // Cek jika ini pesan balasan (quote) dari pesan sebelumnya
                if (message.hasQuotedMsg) {
                    const quoteMessage = await message.getQuotedMessage();
                    const senderId = quoteMessage.from;
                    const quotedId = quoteMessage.id._serialized;
                    if (queue_1.queueService.has(senderId)) {
                        const messageList = queue_1.queueService.get(senderId);
                        if (messageList) {
                            const filtered = messageList.filter(m => m.messageId !== quotedId);
                            // Update map dengan menghapus pesan yang sudah di-quote
                            if (filtered.length > 0) {
                                queue_1.queueService.set(senderId, filtered);
                            }
                            else {
                                queue_1.queueService.remove(senderId);
                            }
                            console.log(`Manual reply pesan ${quotedId}`);
                        }
                    }
                }
                return;
            }
            const messagetype = message.type;
            const chatData = await message.getChat();
            console.log('message type', messagetype);
            if (!chatData.isGroup) {
                if (!(0, allowlist_1.isAllowedChatId)(message.from)) {
                    console.log(`Pesan diabaikan (tidak ada di allowlist): ${message.from}`);
                    return;
                }
                switch (messagetype) {
                    case whatsapp_web_js_1.MessageTypes.TEXT:
                        await (0, textHandler_1.handleTextMessage)(message);
                        break;
                    // Media Types
                    case whatsapp_web_js_1.MessageTypes.AUDIO:
                    case whatsapp_web_js_1.MessageTypes.VOICE:
                    case whatsapp_web_js_1.MessageTypes.IMAGE:
                    case whatsapp_web_js_1.MessageTypes.VIDEO:
                    case whatsapp_web_js_1.MessageTypes.DOCUMENT:
                    case whatsapp_web_js_1.MessageTypes.STICKER:
                    case whatsapp_web_js_1.MessageTypes.LOCATION:
                    case whatsapp_web_js_1.MessageTypes.CONTACT_CARD:
                    case whatsapp_web_js_1.MessageTypes.CONTACT_CARD_MULTI:
                    case whatsapp_web_js_1.MessageTypes.ORDER:
                    case whatsapp_web_js_1.MessageTypes.PRODUCT:
                        (0, mediaHandler_1.handleMediaMessage)(message);
                        break;
                    // Notification / System Types
                    default:
                        (0, notificationHandler_1.handleNotificationMessage)(message);
                        break;
                }
            }
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
};
exports.registerMessageHandlers = registerMessageHandlers;

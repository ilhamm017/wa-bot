"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueService = void 0;
/**
 * Map untuk menyimpan antrian pesan yang diterima.
 */
const messageQueue = new Map();
exports.queueService = {
    add: (chatId, item) => {
        if (!messageQueue.has(chatId)) {
            messageQueue.set(chatId, [item]);
            console.log(`new messageQueue from: ${chatId}`);
        }
        else {
            messageQueue.get(chatId)?.push(item);
            console.log(`add to messageQueue: ${item.messageId}`);
        }
    },
    get: (chatId) => {
        return messageQueue.get(chatId);
    },
    set: (chatId, items) => {
        messageQueue.set(chatId, items);
    },
    remove: (chatId) => {
        messageQueue.delete(chatId);
    },
    has: (chatId) => {
        return messageQueue.has(chatId);
    }
};

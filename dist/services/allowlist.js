"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedChatId = isAllowedChatId;
function normalizeWhatsAppId(value) {
    const trimmed = value.trim();
    if (!trimmed)
        return null;
    if (trimmed.includes('@'))
        return trimmed.toLowerCase();
    const digits = trimmed.replace(/[^\d]/g, '');
    if (!digits)
        return null;
    return `${digits}@c.us`;
}
function parseAllowlist(envValue) {
    if (!envValue)
        return null;
    const entries = envValue
        .split(/[,\n]/g)
        .map(v => normalizeWhatsAppId(v))
        .filter((v) => Boolean(v));
    return new Set(entries);
}
const allowedChatIds = parseAllowlist(process.env.WA_ALLOWED_NUMBERS);
function isAllowedChatId(chatId) {
    if (!allowedChatIds)
        return true;
    return allowedChatIds.has(chatId.toLowerCase());
}

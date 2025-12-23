"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiResponse = getGeminiResponse;
exports.geminiResponseAi = geminiResponseAi;
require("dotenv/config");
const generative_ai_1 = require("@google/generative-ai");
const genai_1 = require("@google/genai");
const apiKey = process.env.Gemini_API_KEY;
if (!apiKey) {
    console.error("Gemini_API_KEY is not defined in .env");
    process.exit(1);
}
const generativeAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const genAI = new genai_1.GoogleGenAI({
    apiKey: apiKey
});
async function getGeminiResponse(prompt) {
    const model = generativeAI.getGenerativeModel({
        model: "gemini-2.0-flash"
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
}
async function geminiResponseAi(chatHistory, prompt) {
    const chat = genAI.chats.create({
        model: "gemini-2.0-flash",
        config: {
            temperature: 2,
            maxOutputTokens: 200,
            systemInstruction: "Lanjutkan percakapan, jawab dengan baik berdasarkan konteks. Jika kamu tidak tahu jawabannya atau ragu, mintalah pengguna untuk menunggu balasan dari admin (saya)."
        },
        history: chatHistory,
    });
    const result = await chat.sendMessage({
        message: prompt
    });
    const text = result.text || "";
    return text;
}

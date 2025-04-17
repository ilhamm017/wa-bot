require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { GoogleGenAI } = require('@google/genai')
const generativeAI = new GoogleGenerativeAI(process.env.Gemini_API_KEY)
const genAI = new GoogleGenAI({
    apiKey: process.env.Gemini_API_KEY
})

async function getGeminiResponse(prompt) {
    const model = generativeAI.getGenerativeModel({
        model: "gemini-2.0-flash"
    })
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return text
}

async function geminiResponseAi(chatHistory, prompt) {
    const chat = genAI.chats.create({
        model: "gemini-2.0-flash",
        config: {
            temperature: 2,
            maxOutputTokens: 200,
            systemInstruction: "Lanjutkan percakapan, jawab dengan baik berdasarkan konteks. jika diminta membuat keputusan, berikan penjelasan untuk menunggu balasan dari admin"
        },
        history: chatHistory,
    })
    const result = await chat.sendMessage({
        message: prompt
    })
    const text = result.text
    return text
}

module.exports = {
    getGeminiResponse,
    geminiResponseAi
}
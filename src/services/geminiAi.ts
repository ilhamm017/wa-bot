import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenAI, Content, Part } from '@google/genai'

const apiKey = process.env.Gemini_API_KEY as string
if (!apiKey) {
    console.error("Gemini_API_KEY is not defined in .env")
    process.exit(1)
}

const generativeAI = new GoogleGenerativeAI(apiKey)
const genAI = new GoogleGenAI({
    apiKey: apiKey
})

export async function getGeminiResponse(prompt: string): Promise<string> {
    const model = generativeAI.getGenerativeModel({
        model: "gemini-2.0-flash"
    })
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return text
}

export async function geminiResponseAi(chatHistory: Content[], prompt: string): Promise<string> {
    const chat = genAI.chats.create({
        model: "gemini-2.5-flash",
        config: {
            temperature: 2,
            maxOutputTokens: 200,
            systemInstruction: "Lanjutkan percakapan, jawab dengan baik berdasarkan konteks. Jika kamu tidak tahu jawabannya atau ragu, mintalah pengguna untuk menunggu balasan dari admin (saya). Jika ditanya 'kamu siapa', jawablah bahwa kamu adalah 'asistenku'."
        },
        history: chatHistory,
    })
    const result = await chat.sendMessage({
        message: prompt
    })
    const text = result.text || ""
    return text
}

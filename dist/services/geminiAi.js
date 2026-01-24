"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiResponse = getGeminiResponse;
exports.geminiResponseAi = geminiResponseAi;
require("dotenv/config");
const generative_ai_1 = require("@google/generative-ai");
const sheets_1 = require("./sheets");
const apiKey = process.env.Gemini_API_KEY;
if (!apiKey) {
    console.error("Gemini_API_KEY is not defined in .env");
    process.exit(1);
}
const generativeAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
// --- Tool Definitions ---
const recordTransactionTool = {
    name: "recordTransaction",
    description: "Mencatat transaksi keuangan (pengeluaran/pemasukan) ke Google Sheets.",
    parameters: {
        type: generative_ai_1.SchemaType.OBJECT,
        properties: {
            date: {
                type: generative_ai_1.SchemaType.STRING,
                description: "Tanggal transaksi (format YYYY-MM-DD). Gunakan tanggal hari ini jika tidak disebutkan."
            },
            category: {
                type: generative_ai_1.SchemaType.STRING,
                description: "Kategori transaksi (misal: Makanan, Transport, Gaji, dll)."
            },
            amount: {
                type: generative_ai_1.SchemaType.NUMBER,
                description: "Jumlah uang dalam Rupiah (angka saja)."
            },
            description: {
                type: generative_ai_1.SchemaType.STRING,
                description: "Keterangan detail transaksi."
            }
        },
        required: ["date", "category", "amount", "description"]
    }
};
const tools = {
    functionDeclarations: [recordTransactionTool]
};
// --- Tool Execution Logic ---
const functions = {
    recordTransaction: async (args) => {
        console.log("Executing tool: recordTransaction", args);
        try {
            await sheets_1.sheetsService.appendRow({
                date: args.date,
                category: args.category,
                amount: args.amount,
                description: args.description
            });
            return { result: "Transaksi berhasil dicatat." };
        }
        catch (error) {
            return { error: `Gagal mencatat transaksi: ${error.message}` };
        }
    }
};
async function getGeminiResponse(prompt) {
    const model = generativeAI.getGenerativeModel({
        model: "gemini-2.0-flash"
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
}
async function geminiResponseAi(chatHistory, prompt) {
    try {
        const model = generativeAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: "Kamu adalah asisten pribadi bernama 'asistenku'. Tugasmu membantu manajemen keuangan dan menjawab pertanyaan umum. Jika user meminta mencatat pengeluaran/pemasukan, GUNAKAN tool 'recordTransaction'. Jangan cuma bilang 'oke dicatat' tanpa memanggil tool.",
            tools: [tools]
        });
        const chat = model.startChat({
            history: chatHistory
        });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        // Handle Function Calls
        const call = response.functionCalls();
        if (call && call.length > 0) {
            const firstCall = call[0];
            const fnName = firstCall.name;
            const fnArgs = firstCall.args;
            if (functions[fnName]) {
                const functionResponse = await functions[fnName](fnArgs);
                // Send function response back to model
                const result2 = await chat.sendMessage([{
                        functionResponse: {
                            name: fnName,
                            response: functionResponse
                        }
                    }]);
                return result2.response.text();
            }
        }
        return response.text();
    }
    catch (error) {
        console.error("Gemini Error:", error);
        return "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
    }
}

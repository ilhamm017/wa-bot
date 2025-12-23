import { GoogleGenerativeAI } from '@google/generative-ai'
import 'dotenv/config'

const apiKey = process.env.Gemini_API_KEY as string
const genAI = new GoogleGenerativeAI(apiKey)

interface Topic {
    id: string;
    description: string;
}

export const aiClassifier = {
    detectIntent: async (message: string, topics: Topic[]): Promise<string | null> => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

            let topicsList = topics.map(t => `- ID: ${t.id}\n  Deskripsi: ${t.description}`).join('\n')

            const prompt = `
Analisis pesan pengguna berikut dan tentukan apakah pesan tersebut relevan dengan salah satu topik di bawah.

Daftar Topik:
${topicsList}

Pesan Pengguna: "${message}"

Instruksi:
- Jika pesan relevan dengan salah satu topik, JAWAB HANYA dengan ID topik tersebut (contoh: "pricing").
- Jika pesan TIDAK relevan dengan topik manapun, jawab "NONE".
- Jangan berikan penjelasan tambahan. Hanya ID atau "NONE".
            `

            const result = await model.generateContent(prompt)
            const response = result.response.text().trim()

            console.log(`AI Classifier Intent: ${response}`)

            if (response === 'NONE') return null

            // Validasi apakah output adalah salah satu ID yang valid
            const validIds = topics.map(t => t.id)
            if (validIds.includes(response)) {
                return response
            }

            return null
        } catch (error) {
            console.error('Error in AI Classifier:', error)
            return null
        }
    }
}

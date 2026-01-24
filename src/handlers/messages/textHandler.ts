import { Message } from 'whatsapp-web.js'
import { Content, Part } from '@google/generative-ai'
import { queueService, QueueItem } from '../../services/queue'
import { geminiResponseAi } from '../../services/geminiAi'
import { aiClassifier } from '../../services/aiClassifier'
import { contextService } from '../../services/contextService'

// Map untuk menyimpan timer debounce setiap chat
const debounceTimers = new Map<string, NodeJS.Timeout>()

export const handleTextMessage = async (message: Message) => {
    const chatId = message.from
    const messageId = message.id._serialized
    const timestamp = Date.now()

    console.log(`Pesan diterima dari ${chatId}: ${message.body}`)

    // Tambahkan pesan ke antrian
    const newQueue: QueueItem = {
        messageId,
        timestamp,
        message: message.body,
        replied: false
    }
    queueService.add(chatId, newQueue)

    // Clear timer sebelumnya jika ada (Debounce)
    if (debounceTimers.has(chatId)) {
        clearTimeout(debounceTimers.get(chatId))
        console.log(`Timer di-reset untuk ${chatId}`)
    }

    // Set timer baru untuk memproses antrian setelah jeda (misal: 6 detik)
    const timer = setTimeout(async () => {
        try {
            console.log(`Timer habis untuk ${chatId}, memproses antrian...`)
            debounceTimers.delete(chatId)

            const messageList = queueService.get(chatId)
            if (!messageList || messageList.length === 0) return

            // Ambil pesan terakhir sebagai referensi untuk reply
            const lastMessageItem = messageList[messageList.length - 1]
            // Kita perlu object Message asli untuk melakukan reply, tapi queue hanya menyimpan data ringan.
            // Solusinya: Menggunakan object `message` dari closure ini mungkin tidak akurat jika ada pesan baru.
            // Tetapi karena kita merespons "percakapan", mereply pesan terakhir yang trigger timer itu wajar.
            // Namun, `message` di scope ini adalah pesan *terakhir* yang men-trigger timer ini (karena setiap pesan baru membuat closure baru).

            // Verifikasi: Timer ini milik pesan terakhir yang masuk.
            // Jadi `message` di sini ADALAH pesan terakhir yang diterima user.

            const chatData = await message.getChat()

            console.log(`Mengambil riwayat chat...`)
            const historyData = await chatData.fetchMessages({
                limit: 20
            })

            // Transform ke format Gemini
            const chatHistory: Content[] = historyData.map(msg => ({
                role: msg.fromMe ? 'model' : 'user',
                parts: [{
                    text: msg.body
                }] as Part[]
            }))

            // Pastikan format role 'user' ada di awal jika history dimulai dari model
            if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
                chatHistory.unshift({
                    role: 'user',
                    parts: [{
                        text: ''
                    }]
                });
            }

            // Prompt tambahan: Instruksi spesifik bisa ditambahkan di sistem prompt geminiAi.ts atau disisipkan di sini.
            // User request: Jika tidak tahu, suruh tunggu "aku" (admin).
            // Kita pass instruction ini lewat prompt terakhir atau modify geminiAi.ts system instruction.
            // Untuk saat ini saya akan gabungkan pesan user degan instruksi tambahan jika perlu, 
            // tapi yang terbaik adalah context system instruction di `geminiAi.ts`. 
            // Namun, user meminta "mendapatkan informasi chat sebelumnya" (sudah di-cover chatHistory)

            // Gabungkan pesan yang ada di queue menjadi satu prompt jika perlu, 
            // atau biarkan chatHistory yang bekerja (karena historyData sudah mencakup pesan-pesan yang baru masuk ke WhatsApp).

            // Kita gunakan body pesan terakhir sebagai trigger prompt utama.
            // --- AI CONTEXT INJECTION START ---
            // Gunakan pesan terakhir sebagai prompt utama untuk klasifikasi
            const userMessage = messageList.map(m => m.message).join('\n') // Gabungkan pesan dalam queue
            console.log(`Mendeteksi intent untuk pesan: "${userMessage.substring(0, 50)}..."`)

            const topics = contextService.getKnowledgeStats()
            const intentId = await aiClassifier.detectIntent(userMessage, topics)

            let finalPrompt = userMessage

            if (intentId) {
                console.log(`Intent terdeteksi: ${intentId}`)
                const knowledgeContent = contextService.getKnowledgeContent(intentId)
                if (knowledgeContent) {
                    finalPrompt = `
[INFORMASI PENTING]: Gunakan informasi berikut untuk menjawab pertanyaan pengguna.
${knowledgeContent}

Pesan Pengguna:
${userMessage}
                    `.trim()
                }
            } else {
                console.log(`Tidak ada intent spesifik terdeteksi.`)
            }
            // --- AI CONTEXT INJECTION END ---

            console.log(`Mengirim ke AI...`)
            // Kita mengirim finalPrompt yang mungkin sudah disisipi konteks
            const response = await geminiResponseAi(chatHistory, finalPrompt)

            await message.reply(response)
            console.log(`Balasan AI terkirim.`)

            // Bersihkan antrian untuk chat ini
            queueService.remove(chatId)

        } catch (error: any) {
            console.error(`Error processing text message: ${error.message}`)
        }
    }, 6000)

    debounceTimers.set(chatId, timer)
}

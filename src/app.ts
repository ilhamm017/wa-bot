import 'dotenv/config'
import { Client, LocalAuth, Message, Chat, MessageAck, MessageTypes } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import { geminiResponseAi } from './services/geminiAi'
import { Content, Part } from '@google/genai'

const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    authStrategy: new LocalAuth()
});

client.initialize()

client.on('qr', (qr: string) => {
    qrcode.generate(qr, {
        small: true
    })
})

client.on('authenticated', () => {
    console.log('Authenticated!')
})

client.on('auth_failure', (msg: string) => {
    console.log('Authentication failed!', msg)
})

client.on('ready', () => {
    console.log('Client is ready!')
})

interface QueueItem {
    messageId: string;
    timestamp: number;
    message: string;
    replied: boolean;
}

/**
 * Map untuk menyimpan antrian pesan yang diterima.
 */
let messageQueue = new Map<string, QueueItem[]>()

client.on('message_create', async (message: Message) => {
    try {
        if (message.fromMe) {
            // Cek jika ini pesan balasan (quote) dari pesan sebelumnya
            if (message.hasQuotedMsg) {
                const quoteMessage = await message.getQuotedMessage()
                const senderId = quoteMessage.from
                const quotedId = quoteMessage.id._serialized
                if (messageQueue.has(senderId)) {
                    const messageList = messageQueue.get(senderId)
                    if (messageList) {
                        const filtered = messageList.filter(m => m.messageId !== quotedId)
                        // Update map dengan menghapus pesan yang sudah di-quote
                        if (filtered.length > 0) {
                            messageQueue.set(senderId, filtered)
                        } else {
                            messageQueue.delete(senderId)
                        }
                        console.log(`Manual reply pesan ${quotedId}`)
                    }
                }
            }
            return
        }

        const chatId = message.from
        const messageId = message.id._serialized
        const timestamp = Date.now()
        const messagetype = message.type
        const chatData = await message.getChat()
        console.log('message type', messagetype)

        if (!chatData.isGroup) {
            switch (messagetype) {
                case MessageTypes.TEXT:
                    console.log('chat message received')
                    const newQueue: QueueItem = {
                        messageId,
                        timestamp,
                        message: message.body,
                        replied: false
                    }

                    if (!messageQueue.has(chatId)) {
                        messageQueue.set(chatId, [newQueue])
                        console.log(`new messageQueue from: ${chatId}`)
                    } else {
                        messageQueue.get(chatId)?.push(newQueue)
                        console.log(`add to messageQueue: ${messageId}`)
                    }

                    // set timer pengecekan 
                    setTimeout(async () => {
                        console.log(`time up, ai will response`)
                        const messageList = messageQueue.get(chatId)
                        if (!messageList) return
                        console.log(`finding terget message in map`)
                        const targetMessage = messageList.find(m => m.messageId === messageId)
                        if (targetMessage && !targetMessage.replied) {
                            console.log(`get chat history`)
                            const historyData = await chatData.fetchMessages({
                                limit: 20
                            })
                            console.log(`rebuld chat history`)

                            // Transform to Gemini Content format
                            const chatHistory: Content[] = historyData.map(msg => ({
                                role: msg.fromMe ? 'model' : 'user',
                                parts: [{
                                    text: msg.body
                                }] as Part[]
                            }))

                            // Tambahkan logika untuk memastikan "user" selalu berada di atas
                            if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
                                chatHistory.unshift({
                                    role: 'user',
                                    parts: [{
                                        text: '' // Bagian text dikosongi
                                    }]
                                });
                            }

                            console.log(`waiting ai response`)
                            const response = await geminiResponseAi(chatHistory, message.body)
                            message.reply(response)
                            console.log(`reply AI`)

                            // Tandai replied dan hapus dari map
                            // Re-fetch to make sure we have latest state
                            const currentList = messageQueue.get(chatId)
                            if (currentList) {
                                const updateList = currentList.filter(m => m.messageId !== messageId)
                                if (updateList.length > 0) {
                                    messageQueue.set(chatId, updateList)
                                } else {
                                    messageQueue.delete(chatId)
                                }
                            }
                        }
                    }, 6000)

                    break
                case MessageTypes.AUDIO:
                    console.log('Audio message received')
                    break
                case MessageTypes.VOICE:
                    console.log('Voice message received')
                    break
                case MessageTypes.IMAGE:
                    console.log('Image message received')
                    break
                case MessageTypes.VIDEO:
                    console.log('Video message received')
                    break
                case MessageTypes.DOCUMENT:
                    console.log('Document message received')
                    break
                case MessageTypes.STICKER:
                    console.log('Sticker message received')
                    break
                case MessageTypes.LOCATION:
                    console.log('Location message received')
                    break
                case MessageTypes.CONTACT_CARD:
                    console.log('Contact card message received')
                    break
                case MessageTypes.CONTACT_CARD_MULTI:
                    console.log('Contact card multi message received')
                    break
                case MessageTypes.ORDER:
                    console.log('Order message received')
                    break
                case MessageTypes.REVOKED:
                    console.log('Revoke message received')
                    break
                case MessageTypes.PRODUCT:
                    console.log('Product message received')
                    break
                case MessageTypes.UNKNOWN:
                    console.log('Unknown message received')
                    break
                case MessageTypes.GROUP_INVITE:
                    console.log('Group invite message received')
                    break
                case MessageTypes.LIST:
                    console.log('List message received')
                    break
                case MessageTypes.LIST_RESPONSE:
                    console.log('List response message received')
                    break
                case MessageTypes.BUTTONS_RESPONSE:
                    console.log('Button response message received')
                    break
                case MessageTypes.PAYMENT:
                    console.log('Payment message received')
                    break
                case MessageTypes.BROADCAST_NOTIFICATION:
                    console.log('Broadcast notification message received')
                    break
                case MessageTypes.CALL_LOG:
                    console.log('Call log message received')
                    break
                case MessageTypes.CIPHERTEXT:
                    console.log('Ciphertext message received')
                    break
                case MessageTypes.DEBUG:
                    console.log('Debug message received')
                    break
                case MessageTypes.E2E_NOTIFICATION:
                    console.log('E2E notification message received')
                    break
                case MessageTypes.GP2:
                    console.log('Group message received')
                    break
                case MessageTypes.GROUP_NOTIFICATION:
                    console.log('Group notification message received')
                    break
                case MessageTypes.HSM:
                    console.log('HSM message received')
                    break
                case MessageTypes.INTERACTIVE:
                    console.log('Interactive message received')
                    break
                case MessageTypes.NATIVE_FLOW:
                    console.log('Native flow message received')
                    break
                case MessageTypes.NOTIFICATION:
                    console.log('Notification message received')
                    break
                case MessageTypes.NOTIFICATION_TEMPLATE:
                    console.log('Notification template message received')
                    break
                case MessageTypes.OVERSIZED:
                    console.log('Oversize message received')
                    break
                case MessageTypes.PROTOCOL:
                    console.log('Protocol message received')
                    break
                case MessageTypes.REACTION:
                    console.log('Reaction message received')
                    break
                case MessageTypes.TEMPLATE_BUTTON_REPLY:
                    console.log('Template button reply message received')
                    break
                case MessageTypes.POLL_CREATION:
                    console.log('Poll creation message received')
                    break
                default:
                    console.log('Unknown message type')
                    break
            }
        }
    } catch (error: any) {
        console.error(`Error: ${error.message}`)
    }
})

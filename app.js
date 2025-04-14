require('dotenv').config()
const {Client, LocalAuth, MessageAck} = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const {getGeminiResponse, geminiResponseAi} = require('./services/geminiAi')

const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    authStrategy: new LocalAuth()
});

client.initialize()

client.on('qr', async (qr) => {
    qrcode.generate(qr, {
        small: true
    })
})

client.on('authenticated', () => {
    console.log('Authenticated!')
})

client.on('auth_failure', () => {
    console.log('Authentication failed!')
})

client.on('ready', () => {
    console.log('Client is ready!')
})

/**
 * Map untuk menyimpan antrian pesan yang diterima.
 */
let messageQueue = new Map()

client.on('message_create', async (message) => {
    try {
        if (message.fromMe){
            // Cek jika ini pesan balasan (quote) dari pesan sebelumnya
            if (message.hasQuotedMsg){
                const quoteMessage = await message.getQuotedMessage()
                const senderId = quoteMessage.from
                const quotedId = quoteMessage.id._serialized
                if (messageQueue.has(senderId)) {
                    const messageList = messageQueue.get(senderId)
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
                case 'chat':
                    console.log('chat message received')
                    const newQueue = {
                        messageId,
                        timestamp,
                        message: message.body,
                        replied: false
                    }
    
                    if (!messageQueue.has(chatId)) {
                        messageQueue.set(chatId, [newQueue])
                        console.log(`new messageQueue from: ${chatId}`)
                    } else {
                        messageQueue.get(chatId).push(newQueue)
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
                            const chatHistory = historyData.map(msg => ({
                                role: msg.fromMe? 'model' : 'user',
                                parts: [{
                                    text: msg.body
                                }]
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
                            const updateList = messageList.filter(m => m.messageId !== messageId)
                            if (updateList.length > 0) {
                                messageQueue.set(chatId, updateList)
                            } else {
                                messageQueue.delete(chatId)
                            }
                        }
                    }, 6000)
    
                    break
                case 'audio':
                    console.log('Audio message received')
                    break
                case 'voice':
                    console.log('Voice message received')
                    break
                case 'image':
                    console.log('Image message received')
                    break
                case 'video':
                    console.log('Video message received')
                    break
                case 'document':
                    console.log('Document message received')
                    break
                case 'sticker':
                    console.log('Sticker message received')
                    break
                case 'location':
                    console.log('Location message received')
                    break
                case 'vcard':
                    console.log('Contact card message received')
                    break
                case 'multi_vcard':
                    console.log('Contact card multi message received')
                    break
                case 'order':
                    console.log('Order message received')
                    break
                case 'revoke':
                    console.log('Revoke message received')
                    break
                case 'product':
                    console.log('Product message received')
                    break
                case 'unknown':
                    console.log('Unknown message received')
                    break
                case 'group_invite':
                    console.log('Group invite message received')
                    break
                case 'list':
                    console.log('List message received')
                    break
                case 'list_response':
                    console.log('List response message received')
                    break
                case 'button_response':
                    console.log('Button response message received')
                    break
                case 'payment':
                    console.log('Payment message received')
                    break
                case 'broadcat_notification':
                    console.log('Broadcast notification message received')
                    break
                case 'call_log':
                    console.log('Call log message received')
                    break
                case 'ciphertext':
                    console.log('Ciphertext message received')
                    break
                case 'debug':
                    console.log('Debug message received')
                    break
                case 'e2e_notification':
                    console.log('E2E notification message received')
                    break
                case 'gp2p':
                    console.log('Group message received')
                    break
                case 'group_notification':
                    console.log('Group notification message received')
                    break
                case 'hsm':
                    console.log('HSM message received')
                    break
                case 'interactive':
                    console.log('Interactive message received')
                    break
                case 'native_flow':
                    console.log('Native flow message received')
                    break
                case 'notification':
                    console.log('Notification message received')
                    break
                case 'notification_template':
                    console.log('Notification template message received')
                    break
                case 'oversize':
                    console.log('Oversize message received')
                    break
                case 'protocol':
                    console.log('Protocol message received')
                    break
                case 'reaction':
                    console.log('Reaction message received')
                    break
                case 'template_button_reply':
                    console.log('Template button reply message received')
                    break
                case 'poll_creation':
                    console.log('Poll creation message received')
                    break
                default:
                    console.log('Unknown message type')
                    break
            }
        }
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
})
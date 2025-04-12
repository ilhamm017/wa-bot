require('dotenv').config()
const {Client, LocalAuth} = require('whatsapp-web.js')
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
 /**
 * Berisi data dari pesan yang diterima.
 */
 let chatData = null
 /**
 * Sumber pesan (Pengirim) yang akan digunakan acuan untuk memproses data pengguna.
 */
 let sourceMessage = null

// client.on('message', async (message) => {
//     try {
//         chatData = await message.getChat() 
//         sourceMessage = message.from

//         if(!chatData.isGroup) { // Jika pesan bukan dari grup
//             if (!messageQueue.has(sourceMessage)) { // Jika antrian untuk pengirim ini belum ada, buat baru
//                 messageQueue.set(sourceMessage, []);
//             }
//             if(message.body.startsWith('!')){ // Jika pesan diawali dengan '!'
//                 messageQueue.get(sourceMessage).push(async () => {
//                     try {
//                         const response = await getGeminiResponse(message.body);
//                         await client.sendMessage(sourceMessage, response);
//                     } catch (err) {
//                         console.error('Error processing message:', err);
//                     }
//                 });
//             }
//             const messages = await chatData.fetchMessages({
//                 limit: 10
//             });
//             const chatHistory = messages.reverse().map(msg => ({
//                 role: msg.fromMe ? 'model' : 'user',
//                 parts: [{
//                     text: msg.body
//                 }]
//             }));

//             messageQueue.get(sourceMessage).push({
//                 id: message.id._serialized,
//                 from: message.from,
//                 body: message.body,
//                 replied: false,
//                 timestamp: new Date().getTime()
//             });
             
//             if (messageQueue.get(sourceMessage).length >= 1) {
//                 while (messageQueue.get(sourceMessage).length > 0) {
//                     const task = messageQueue.get(sourceMessage).shift();
//                     await task();
//                 }
//                 messageQueue.delete(sourceMessage);
//             }
//         } else {
//             console.log('Message is from a group, ignoring...');
//         }
//     } catch (error) {
//         console.log('Error:', error);
//     }   
// });

client.on('message_create', async (message) => {
    console.log('message triggered')
    try {
        chatData = await message.getChat()
        // console.log(chatData)
        sourceMessage = message.from
        const myMessage  = message.fromMe
        // if (!pesanku) {
        //     client.sendMessage(sourceMessage,'awkwkwkwk')
        // }
        if (!chatData.isGroup) {
            console.log(`pesan personal: id ${message.id.id}`)
            if (!messageQueue.has(sourceMessage)){
                messageQueue.set(sourceMessage, [])
            }
            //=============================================================
            if (message.hasQuotedMsg) {
                const quoteData = await message.getQuotedMessage()
                // const quoteId = quoteData.lastMessage._data.quotedStanzaID
                // console.log(quoteData)
                if (myMessage) {
                    const sourceQuote = await client.getChatById(quoteData.from)
                    if (messageQueue.get(quoteData.from).length >=1) {
                        const arrayData = await messageQueue.get(quoteData.from).filter(item => !item.replied)
                        console.log(arrayData)
                        console.log(quoteData.from)
                        if (arrayData) {
                            const quotedMessageID = sourceQuote.lastMessage._data.quotedStanzaID
                            console.log(quotedMessageID)
                            const unRepliedMessage = await messageQueue.get(quoteData.from).filter(item => item.id != quotedMessageID )
                            messageQueue.set(quoteData.from, unRepliedMessage)
                            // Lanjut di sini (Perbaiki penghapusan data yang sudah di reply)

                        }
                    }
                    console.log(`pesan quoted dari Message: id ${sourceQuote.lastMessage._data.quotedStanzaID}`)
                }
            }
            //=============================================================
            if (!myMessage) {
                messageQueue.get(sourceMessage).push({
                    id: chatData.lastMessage.id.id,
                    from: message.from,
                    body: message.body,
                    replied: false,
                    timestamp: message.timestamp
                })
                console.log(messageQueue.get(sourceMessage))
            }
        } else {
            console.log(`pesan dari grub`)
        }
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
})
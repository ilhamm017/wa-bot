import { Client, Message, MessageTypes } from 'whatsapp-web.js'
import { queueService } from '../services/queue'
import { handleTextMessage } from './messages/textHandler'
import { handleMediaMessage } from './messages/mediaHandler'
import { handleNotificationMessage } from './messages/notificationHandler'

export const registerMessageHandlers = (client: Client) => {
    client.on('message_create', async (message: Message) => {
        try {
            if (message.fromMe) {
                // Cek jika ini pesan balasan (quote) dari pesan sebelumnya
                if (message.hasQuotedMsg) {
                    const quoteMessage = await message.getQuotedMessage()
                    const senderId = quoteMessage.from
                    const quotedId = quoteMessage.id._serialized
                    if (queueService.has(senderId)) {
                        const messageList = queueService.get(senderId)
                        if (messageList) {
                            const filtered = messageList.filter(m => m.messageId !== quotedId)
                            // Update map dengan menghapus pesan yang sudah di-quote
                            if (filtered.length > 0) {
                                queueService.set(senderId, filtered)
                            } else {
                                queueService.remove(senderId)
                            }
                            console.log(`Manual reply pesan ${quotedId}`)
                        }
                    }
                }
                return
            }

            const messagetype = message.type
            const chatData = await message.getChat()
            console.log('message type', messagetype)

            if (!chatData.isGroup) {
                switch (messagetype) {
                    case MessageTypes.TEXT:
                        await handleTextMessage(message)
                        break

                    // Media Types
                    case MessageTypes.AUDIO:
                    case MessageTypes.VOICE:
                    case MessageTypes.IMAGE:
                    case MessageTypes.VIDEO:
                    case MessageTypes.DOCUMENT:
                    case MessageTypes.STICKER:
                    case MessageTypes.LOCATION:
                    case MessageTypes.CONTACT_CARD:
                    case MessageTypes.CONTACT_CARD_MULTI:
                    case MessageTypes.ORDER:
                    case MessageTypes.PRODUCT:
                        handleMediaMessage(message)
                        break

                    // Notification / System Types
                    default:
                        handleNotificationMessage(message)
                        break
                }
            }
        } catch (error: any) {
            console.error(`Error: ${error.message}`)
        }
    })
}

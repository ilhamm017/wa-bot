import { Message, MessageTypes } from 'whatsapp-web.js'

export const handleMediaMessage = (message: Message) => {
    switch (message.type) {
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
        case MessageTypes.PRODUCT:
            console.log('Product message received')
            break
        default:
            console.log(`Media/Other message type received: ${message.type}`)
            break
    }
}

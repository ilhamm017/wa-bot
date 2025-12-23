import { Message, MessageTypes } from 'whatsapp-web.js'

export const handleNotificationMessage = (message: Message) => {
    switch (message.type) {
        case MessageTypes.REVOKED:
            console.log('Revoke message received')
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
            console.log(`Notification/Other message type received: ${message.type}`)
            break
    }
}

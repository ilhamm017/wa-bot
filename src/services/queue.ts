export interface QueueItem {
    messageId: string;
    timestamp: number;
    message: string;
    replied: boolean;
}

/**
 * Map untuk menyimpan antrian pesan yang diterima.
 */
const messageQueue = new Map<string, QueueItem[]>()

export const queueService = {
    add: (chatId: string, item: QueueItem) => {
        if (!messageQueue.has(chatId)) {
            messageQueue.set(chatId, [item])
            console.log(`new messageQueue from: ${chatId}`)
        } else {
            messageQueue.get(chatId)?.push(item)
            console.log(`add to messageQueue: ${item.messageId}`)
        }
    },

    get: (chatId: string) => {
        return messageQueue.get(chatId)
    },

    set: (chatId: string, items: QueueItem[]) => {
        messageQueue.set(chatId, items)
    },

    remove: (chatId: string) => {
        messageQueue.delete(chatId)
    },

    has: (chatId: string) => {
        return messageQueue.has(chatId)
    }
}

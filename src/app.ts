import 'dotenv/config'
import { client } from './config/client'
import { registerSystemHandlers } from './handlers/system'
import { registerMessageHandlers } from './handlers/message'

// Register handlers
registerSystemHandlers(client)
registerMessageHandlers(client)

// Initialize client
client.initialize()

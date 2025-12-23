import { Client } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

export const registerSystemHandlers = (client: Client) => {
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
}

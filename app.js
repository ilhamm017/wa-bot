const {Client, LocalAuth} = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
        headless: false
    }
})

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




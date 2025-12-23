import { Client, LocalAuth } from 'whatsapp-web.js'


export const client = new Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/usr/bin/chromium-browser'
    },
    authStrategy: new LocalAuth()
});

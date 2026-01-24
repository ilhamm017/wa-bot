import { google } from 'googleapis'
import 'dotenv/config'
import path from 'path'

const SERVICE_ACCOUNT_FILE = path.join(process.cwd(), 'google-service-account.json')
const SPREADSHEET_ID = process.env.SPREADSHEET_ID

if (!SPREADSHEET_ID) {
    console.warn("SPREADSHEET_ID is not defined in .env")
}

const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

export interface TransactionData {
    date: string;
    category: string;
    amount: number;
    description: string;
}

export const sheetsService = {
    appendRow: async (data: TransactionData) => {
        try {
            if (!SPREADSHEET_ID) {
                throw new Error("Spreadsheet ID missing")
            }

            const values = [[
                data.date,
                data.category,
                data.amount,
                data.description
            ]]

            const response = await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A:D', // Asumsi nama sheet default
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values
                }
            })

            console.log(`Row appended successfully.`)
            return response.data
        } catch (error: any) {
            console.error(`Error appending to sheets: ${error.message}`)
            throw error
        }
    }
}

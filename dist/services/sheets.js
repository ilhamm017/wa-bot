"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sheetsService = void 0;
const googleapis_1 = require("googleapis");
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const SERVICE_ACCOUNT_FILE = path_1.default.join(process.cwd(), 'google-service-account.json');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
if (!SPREADSHEET_ID) {
    console.warn("SPREADSHEET_ID is not defined in .env");
}
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = googleapis_1.google.sheets({ version: 'v4', auth });
exports.sheetsService = {
    appendRow: async (data) => {
        try {
            if (!SPREADSHEET_ID) {
                throw new Error("Spreadsheet ID missing");
            }
            const values = [[
                    data.date,
                    data.category,
                    data.amount,
                    data.description
                ]];
            const response = await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A:D', // Asumsi nama sheet default
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values
                }
            });
            console.log(`Row appended successfully.`);
            return response.data;
        }
        catch (error) {
            console.error(`Error appending to sheets: ${error.message}`);
            throw error;
        }
    }
};

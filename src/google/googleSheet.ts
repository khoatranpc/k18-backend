import { google } from "googleapis";
import { Obj } from "../global/interface";




function calculateRange(startColumn: string, startRow: number, values: string[][]) {
    const numRows = values.length;
    const numCols = Math.max(...values.map(row => row.length));

    const endColumn = String.fromCharCode(startColumn.charCodeAt(0) + numCols - 1);

    return `${startColumn}${startRow}:${endColumn}${startRow + numRows - 1}`;
}

const googleSheet = async (feedback: string[]) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'googlesheetteachingk18.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({
        version: "v4",
        auth: client as any
    });
    const values = [
        feedback
    ];
    const spreadSheetId = "1Rg8XeDsupNUzQYpUiSeiCI28ggcp23RntP8pMFfRnTs";
    return await googleSheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: spreadSheetId,
        range: `Responses!${calculateRange('A', 3, values)}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values
        }
    })
}

export default googleSheet;
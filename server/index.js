require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const app = express();
app.use(express.json());

const auth = new google.auth.JWT(
  process.env.SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

app.get('/orders', async (_req, res) => {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Commandes!A2:E'
    });
    res.json(result.data.values || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/orders/:index', async (req, res) => {
  const row = Number(req.params.index) + 2;
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Commandes!A${row}:E${row}`,
      valueInputOption: 'RAW',
      requestBody: { values: [req.body] }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on ' + PORT));

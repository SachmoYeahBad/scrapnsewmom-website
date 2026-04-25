# Google Sheets Setup Guide
## ScrapNSewMom — Class Registration Integration

Follow these steps once to connect your registration forms to Google Sheets. After setup, every completed registration will automatically appear as a new row in your spreadsheet.

---

## Step 1 — Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and sign in with your Google account.
2. Click **+ Blank** to create a new spreadsheet.
3. Rename it to something memorable, like **ScrapNSewMom Registrations** (click the title at the top to edit it).
4. Leave the spreadsheet open — you'll need it in a moment.

---

## Step 2 — Open the Apps Script Editor

1. In your Google Sheet, click the menu: **Extensions → Apps Script**
2. A new browser tab will open with the script editor.
3. Delete all the existing placeholder code in the editor (select all, then delete).

---

## Step 3 — Paste the Script

1. Open the file **`google-apps-script.js`** from this folder.
2. Copy the entire contents of that file.
3. Paste it into the Apps Script editor (the area where you deleted the placeholder code).
4. Click the **Save** button (floppy disk icon, or press Ctrl+S / Cmd+S).
5. Name the project **ScrapNSewMom** when prompted.

---

## Step 4 — Test the Script (Optional but Recommended)

1. In the Apps Script editor, click the function dropdown near the top (it may say `doPost` or `Select function`).
2. Choose **`testSetup`** from the dropdown.
3. Click the **▶ Run** button.
4. The first time you run it, Google will ask for permissions — click **Review permissions**, choose your Google account, then click **Allow**.
5. After it runs, switch back to your Google Sheet tab and refresh the page.
6. You should see two new tabs at the bottom: **Patriotic Wreath Class** and **All Things Summer Wreath Class**, each with a styled header row and one test entry.
7. If the tabs and data appear, the script is working correctly. You can delete the test rows from the sheet.

---

## Step 5 — Deploy as a Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear icon ⚙ next to "Select type" and choose **Web app**.
3. Fill in the settings:
   - **Description:** ScrapNSewMom Registration Handler
   - **Execute as:** Me *(your Google account)*
   - **Who has access:** Anyone
4. Click **Deploy**.
5. Google may ask you to authorize again — click **Authorize access** and follow the prompts.
6. After deploying, you'll see a screen with a **Web app URL** — it will look something like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
7. **Copy this URL** — you'll need it in the next step.

---

## Step 6 — Add the URL to Your Registration Pages

You need to paste the Web app URL into **two HTML files**.

### Patriotic Wreath Registration Page

1. Open **`patriotic-wreath-registration.html`** in a text editor (Notepad, TextEdit, VS Code, etc.).
2. Search for this line near the bottom of the file:
   ```
   sheetsUrl:  'YOUR_APPS_SCRIPT_URL_HERE',
   ```
3. Replace `YOUR_APPS_SCRIPT_URL_HERE` with the URL you copied, keeping the quotes:
   ```
   sheetsUrl:  'https://script.google.com/macros/s/AKfycb.../exec',
   ```
4. Save the file.

### Summer Wreath Registration Page

1. Open **`summer-wreath-registration.html`** in a text editor.
2. Search for the same line:
   ```
   sheetsUrl:   'YOUR_APPS_SCRIPT_URL_HERE',
   ```
3. Replace it with your URL the same way.
4. Save the file.

---

## Step 7 — Upload to Cloudflare Pages

After updating both HTML files, upload them to Cloudflare Pages as usual. From that point forward, whenever a customer completes payment and clicks **"I've Completed My Payment"**, their registration info will be sent directly to your Google Sheet.

---

## What Gets Recorded

Each registration creates one new row with these columns:

| Column | What it contains |
|---|---|
| Timestamp | Date and time of registration |
| Name | Customer's full name |
| Email | Customer's email address |
| Phone | Customer's phone number |
| Referral Source | How they heard about the class |
| Class Date | The session they signed up for |
| Wreath Style | Their chosen style |
| Attachment Add-On | Whether they added the attachment (+$10) |
| Payment Method | Venmo, PayPal, or Square |
| Total Due | Total amount owed |

Registrations for the Patriotic class go to the **Patriotic Wreath Class** tab, and summer registrations go to the **All Things Summer Wreath Class** tab.

---

## Troubleshooting

**Rows aren't appearing in the sheet**
- Make sure you deployed the script with "Who has access: Anyone" — not "Only myself."
- Re-check that the URL in both HTML files exactly matches the Web app URL (no extra spaces or missing characters).
- Open your browser's developer console (F12) while testing a registration and look for any errors in the Console tab.

**"Authorization required" error when running testSetup**
- Click "Review permissions," select your Google account, and click "Allow." This is a one-time step.

**You changed the script and the sheet isn't updating**
- Any time you edit the Apps Script code, you must create a **new deployment**: click **Deploy → New deployment** again and repeat Step 5. The old URL will stop working after a new deployment is created.

---

*Guide prepared for ScrapNSewMom — Amy Harrington, Winslow, Maine*

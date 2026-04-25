// ============================================================
//  ScrapNSewMom – Class Registration → Google Sheets
//  Paste this entire file into Google Apps Script and deploy
//  as a Web App. See SETUP-GUIDE.md for full instructions.
// ============================================================

// Sheet tab names — must match exactly
var SHEET_PATRIOTIC = 'Patriotic Wreath Class';
var SHEET_SUMMER    = 'All Things Summer Wreath Class';

// Column headers for each sheet
var HEADERS = [
  'Timestamp',
  'Name',
  'Email',
  'Phone',
  'Referral Source',
  'Class Date',
  'Wreath Style',
  'Attachment Add-On',
  'Payment Method',
  'Total Due'
];

// ── Main entry point ─────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss   = SpreadsheetApp.getActiveSpreadsheet();

    // Route to the correct tab based on class name
    var sheetName = data.className && data.className.toLowerCase().includes('summer')
      ? SHEET_SUMMER
      : SHEET_PATRIOTIC;

    var sheet = getOrCreateSheet(ss, sheetName);

    // Append the registration as a new row
    sheet.appendRow([
      data.timestamp   || new Date().toLocaleString(),
      data.name        || '',
      data.email       || '',
      data.phone       || '',
      data.referral    || '',
      data.classDate   || '',
      data.style       || '',
      data.addon       || '',
      data.payment     || '',
      data.totalDue    || ''
    ]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, HEADERS.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Helper: get existing sheet or create it with headers ─────
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    var headerRow = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRow.setValues([HEADERS]);

    // Style the header row
    headerRow.setBackground('#1a2a4a');
    headerRow.setFontColor('#ffffff');
    headerRow.setFontWeight('bold');
    headerRow.setFontSize(11);

    // Freeze the header row
    sheet.setFrozenRows(1);

    // Set a reasonable default column width
    sheet.setColumnWidth(1, 160);  // Timestamp
    sheet.setColumnWidth(2, 160);  // Name
    sheet.setColumnWidth(3, 200);  // Email
    sheet.setColumnWidth(4, 130);  // Phone
    sheet.setColumnWidth(5, 160);  // Referral Source
    sheet.setColumnWidth(6, 150);  // Class Date
    sheet.setColumnWidth(7, 180);  // Wreath Style
    sheet.setColumnWidth(8, 150);  // Attachment Add-On
    sheet.setColumnWidth(9, 150);  // Payment Method
    sheet.setColumnWidth(10, 100); // Total Due
  }

  return sheet;
}

// ── Test function — run this manually to verify setup ────────
function testSetup() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        timestamp:  new Date().toLocaleString(),
        name:       'Test Customer',
        email:      'test@example.com',
        phone:      '(207) 555-0100',
        referral:   'Facebook',
        classDate:  'Saturday, April 25',
        style:      'Classic Red, White & Blue',
        addon:      'Yes (+$10)',
        payment:    'venmo',
        totalDue:   '$60.00',
        className:  'Patriotic Wreath Class'
      })
    }
  };
  var result = doPost(testData);
  Logger.log(result.getContent());
}

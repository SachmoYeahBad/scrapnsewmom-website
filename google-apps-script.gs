// ============================================================
//  ScrapNSewMom — Registration Google Apps Script
//  Paste this entire file into your Apps Script editor,
//  then redeploy as a new version (see instructions.md).
// ============================================================

var NOTIFY_EMAIL = 'scrapnsewmom@gmail.com';
var NOTIFY_CLASSES = ['VFW Wreath Class', 'All Things Summer Wreath Class'];

// ── Hoodie order tab config ───────────────────────────────────
var HOODIE_TAB = 'Hoodie Orders 2026';
var HOODIE_HEADERS = [
  'Timestamp', 'Name', 'Email', 'Phone',
  '# Hoodies', 'Item Details',
  'Subtotal', 'CC Fee', 'Total', 'Payment Method'
];

// Tab name → column headers for each class
const TAB_CONFIG = {
  'Patriotic Wreath Class': {
    tab: 'Patriotic Wreath Class',
    headers: [
      'Timestamp', 'Name', 'Email', 'Phone', 'How Did You Hear',
      'Class Date', 'Wreath Style', 'Attachment Add-On',
      'Payment Method', 'Total Due', 'Class'
    ],
    row: (d) => [
      d.timestamp, d.name, d.email, d.phone, d.referral,
      d.classDate, d.style, d.addon,
      d.payment, d.totalDue, d.className
    ]
  },
  'All Things Summer Wreath Class': {
    tab: 'Summer Wreath Class',
    headers: [
      'Timestamp', 'Name', 'Email', 'Phone', 'How Did You Hear',
      'Class Date', 'Wreath Style', 'Attachment Add-On',
      'Payment Method', 'Total Due', 'Class'
    ],
    row: (d) => [
      d.timestamp, d.name, d.email, d.phone, d.referral,
      d.classDate, d.style, d.addon,
      d.payment, d.totalDue, d.className
    ]
  },
  'VFW Wreath Class': {
    tab: 'VFW Wreath Class',
    headers: [
      'Timestamp', 'Name', 'Email', 'Phone', 'How Did You Hear',
      'Class Date', 'Location', 'Wreath Style', 'Notes',
      'Payment Method', 'Total Due', 'Class'
    ],
    row: (d) => [
      d.timestamp, d.name, d.email, d.phone, d.referral,
      d.classDate, d.location, d.style, d.notes,
      d.payment, d.totalDue, d.className
    ]
  }
};

function sendNotificationEmail(d, className) {
  var subject = 'New Registration: ' + className + ' — ' + (d.name || 'Unknown');
  var body = 'New registration received!\n\n' +
    'Class: ' + className + '\n' +
    'Name: ' + (d.name || '') + '\n' +
    'Email: ' + (d.email || '') + '\n' +
    'Phone: ' + (d.phone || '') + '\n' +
    'How Did You Hear: ' + (d.referral || '') + '\n' +
    'Class Date: ' + (d.classDate || '') + '\n' +
    (d.location ? 'Location: ' + d.location + '\n' : '') +
    'Wreath Style: ' + (d.style || '') + '\n' +
    (d.addon ? 'Attachment Add-On: ' + d.addon + '\n' : '') +
    (d.notes ? 'Notes: ' + d.notes + '\n' : '') +
    'Payment Method: ' + (d.payment || '') + '\n' +
    'Total Due: ' + (d.totalDue || '') + '\n' +
    'Timestamp: ' + (d.timestamp || '');
  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

// ── Hoodie order handler ──────────────────────────────────────
function handleHoodieOrder(data, ss) {
  // Get or create the Hoodie Orders tab
  var sheet = ss.getSheetByName(HOODIE_TAB);
  if (!sheet) {
    sheet = ss.insertSheet(HOODIE_TAB);
    sheet.appendRow(HOODIE_HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, HOODIE_HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a2a4a');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);  // Timestamp
    sheet.setColumnWidth(2, 150);  // Name
    sheet.setColumnWidth(3, 200);  // Email
    sheet.setColumnWidth(4, 130);  // Phone
    sheet.setColumnWidth(5, 80);   // # Hoodies
    sheet.setColumnWidth(6, 380);  // Item Details
    sheet.setColumnWidth(7, 90);   // Subtotal
    sheet.setColumnWidth(8, 80);   // CC Fee
    sheet.setColumnWidth(9, 90);   // Total
    sheet.setColumnWidth(10, 140); // Payment Method
  }

  // Flatten items array into a readable multi-line string
  var items = data.items || [];
  var itemDetails = items.map(function(item, i) {
    var line = (i + 1) + '. ' + (item.logo || '') + ' | ' + (item.size || '') + ' ($' + (item.sizePrice || 0) + ')';
    if (item.personalizations && item.personalizations !== 'None') {
      line += ' | ' + item.personalizations + ' (+$' + (item.pzTotal || 0) + ')';
    }
    line += ' = $' + (item.itemTotal || 0);
    return line;
  }).join('\n');

  sheet.appendRow([
    data.timestamp  || new Date().toLocaleString(),
    data.name       || '',
    data.email      || '',
    data.phone      || '',
    data.itemCount  || items.length,
    itemDetails,
    '$' + (data.subtotal || 0),
    data.ccFee > 0 ? '$' + data.ccFee : '',
    '$' + (data.total || 0),
    data.payment    || ''
  ]);

  // Wrap text in the Item Details column for readability
  sheet.getRange(sheet.getLastRow(), 6).setWrap(true);

  // Send notification email
  var subject = 'New Hoodie Order — ' + (data.name || 'Unknown') + ' (' + (data.itemCount || items.length) + ' hoodie(s))';
  var body = 'New hoodie order received!\n\n' +
    'Name: ' + (data.name || '') + '\n' +
    'Email: ' + (data.email || '') + '\n' +
    'Phone: ' + (data.phone || '') + '\n\n' +
    'Items:\n' + itemDetails + '\n\n' +
    'Subtotal: $' + (data.subtotal || 0) + '\n' +
    (data.ccFee > 0 ? 'CC Fee: $' + data.ccFee + '\n' : '') +
    'Total: $' + (data.total || 0) + '\n' +
    'Payment: ' + (data.payment || '') + '\n\n' +
    'Timestamp: ' + (data.timestamp || '');
  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // ── Route hoodie/apparel orders to their own sheet ──
    if (data.type === 'hoodie_order_2026') {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      handleHoodieOrder(data, ss);
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var className = data.className || '';

    // Look up the config for this class
    var config = TAB_CONFIG[className];

    // If we don't recognize the class name, dump to a catch-all tab
    if (!config) {
      config = {
        tab: 'Other Registrations',
        headers: [
          'Timestamp', 'Name', 'Email', 'Phone', 'How Did You Hear',
          'Class Date', 'Wreath Style', 'Notes',
          'Payment Method', 'Total Due', 'Class'
        ],
        row: (d) => [
          d.timestamp || '', d.name || '', d.email || '', d.phone || '',
          d.referral || '', d.classDate || '', d.style || '', d.notes || '',
          d.payment || '', d.totalDue || '', d.className || ''
        ]
      };
    }

    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(config.tab);

    // Create the tab if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(config.tab);
      sheet.appendRow(config.headers);

      // Bold + freeze the header row
      var headerRange = sheet.getRange(1, 1, 1, config.headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1a2a4a');
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);

      // Auto-resize columns
      sheet.autoResizeColumns(1, config.headers.length);
    }

    // Append the registration row
    sheet.appendRow(config.row(data));

    // Send notification email for VFW and Summer classes
    if (NOTIFY_CLASSES.indexOf(className) !== -1) {
      sendNotificationEmail(data, className);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: run this function manually once to pre-create all tabs
function setupAllTabs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Class registration tabs
  Object.values(TAB_CONFIG).forEach(function(config) {
    var sheet = ss.getSheetByName(config.tab);
    if (!sheet) {
      sheet = ss.insertSheet(config.tab);
    }
    sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
    var headerRange = sheet.getRange(1, 1, 1, config.headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a2a4a');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, config.headers.length);
    Logger.log('Set up tab: ' + config.tab);
  });

  // Hoodie orders tab
  var hoodieSheet = ss.getSheetByName(HOODIE_TAB);
  if (!hoodieSheet) {
    hoodieSheet = ss.insertSheet(HOODIE_TAB);
  }
  hoodieSheet.getRange(1, 1, 1, HOODIE_HEADERS.length).setValues([HOODIE_HEADERS]);
  var hoodieHeaderRange = hoodieSheet.getRange(1, 1, 1, HOODIE_HEADERS.length);
  hoodieHeaderRange.setFontWeight('bold');
  hoodieHeaderRange.setBackground('#1a2a4a');
  hoodieHeaderRange.setFontColor('#ffffff');
  hoodieSheet.setFrozenRows(1);
  hoodieSheet.autoResizeColumns(1, HOODIE_HEADERS.length);
  Logger.log('Set up tab: ' + HOODIE_TAB);
}

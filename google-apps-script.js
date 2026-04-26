// ============================================================
//  ScrapNSewMom -- Registration Google Apps Script
//  Paste this entire file into your Apps Script editor,
//  then redeploy as a new version (see instructions.md).
// ============================================================

var NOTIFY_EMAIL = 'scrapnsewmom@gmail.com';
var NOTIFY_CLASSES = ['VFW Wreath Class', 'All Things Summer Wreath Class'];

// Tab name -> column headers for each class
var TAB_CONFIG = {
    'Patriotic Wreath Class': {
          tab: 'Patriotic Wreath Class',
          headers: [
                  'Timestamp', 'Name', 'Email', 'Phone', 'How Did You Hear',
                  'Class Date', 'Wreath Style', 'Attachment Add-On',
                  'Payment Method', 'Total Due', 'Class'
                ],
          row: function(d) { return [
                  d.timestamp, d.name, d.email, d.phone, d.referral,
                  d.classDate, d.style, d.addon,
                  d.payment, d.totalDue, d.className
                ]; }
    },
    'All Things Summer Wreath Class': {
          tab: 'Summer Wreath Class',
          headers: [
                  'Timestamp', 'Name', 'Email', 'Phone', 'How Did You Hear',
                  'Class Date', 'Wreath Style', 'Attachment Add-On',
                  'Payment Method', 'Total Due', 'Class'
                ],
          row: function(d) { return [
                  d.timestamp, d.name, d.email, d.phone, d.referral,
                  d.classDate, d.style, d.addon,
                  d.payment, d.totalDue, d.className
                ]; }
    },
    'VFW Wreath Class': {
          tab: 'VFW Wreath Class',
          headers: [
                  'Timestamp', 'Name', 'Email', 'Phone', 'How Did You Hear',
                  'Class Date', 'Location', 'Wreath Style', 'Notes',
                  'Payment Method', 'Total Due', 'Class'
                ],
          row: function(d) { return [
                  d.timestamp, d.name, d.email, d.phone, d.referral,
                  d.classDate, d.location, d.style, d.notes,
                  d.payment, d.totalDue, d.className
                ]; }
    }
};

function sendNotificationEmail(d, className) {
    var subject = 'New Registration: ' + className + ' - ' + (d.name || 'Unknown');
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

function doPost(e) {
    try {
          var data = JSON.parse(e.postData.contents);
          var className = data.className || '';

      var config = TAB_CONFIG[className];

      if (!config) {
              config = {
                        tab: 'Other Registrations',
                        headers: [
                                    'Timestamp', 'Name', 'Email', 'Phone', 'How Did You Hear',
                                    'Class Date', 'Wreath Style', 'Notes',
                                    'Payment Method', 'Total Due', 'Class'
                                  ],
                        row: function(d) { return [
                                    d.timestamp || '', d.name || '', d.email || '', d.phone || '',
                                    d.referral || '', d.classDate || '', d.style || '', d.notes || '',
                                    d.payment || '', d.totalDue || '', d.className || ''
                                  ]; }
              };
      }

      var ss    = SpreadsheetApp.getActiveSpreadsheet();
          var sheet = ss.getSheetByName(config.tab);

      if (!sheet) {
              sheet = ss.insertSheet(config.tab);
              sheet.appendRow(config.headers);
              var headerRange = sheet.getRange(1, 1, 1, config.headers.length);
              headerRange.setFontWeight('bold');
              headerRange.setBackground('#1a2a4a');
              headerRange.setFontColor('#ffffff');
              sheet.setFrozenRows(1);
              sheet.autoResizeColumns(1, config.headers.length);
      }

      sheet.appendRow(config.row(data));

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

function setupAllTabs() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

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
}', message: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
}
}

function setupAllTabs() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

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
}

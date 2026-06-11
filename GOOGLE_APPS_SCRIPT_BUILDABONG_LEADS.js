/**
 * Build-A-Bong Lead Backup Receiver
 * Paste this into Google Apps Script, connect it to a Google Sheet, deploy as a Web App,
 * then paste the Web App URL into form-config.js as BUILDABONG_BACKUP_ENDPOINT.
 *
 * Script Properties you can set:
 * ADMIN_EMAIL = admin@pixies-pantry.com
 * DISCORD_WEBHOOK_URL = your private Discord webhook URL (optional)
 */
function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var adminEmail = props.getProperty('ADMIN_EMAIL') || 'admin@pixies-pantry.com';
  var discordWebhook = props.getProperty('DISCORD_WEBHOOK_URL') || '';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Build-A-Bong Leads') || ss.insertSheet('Build-A-Bong Leads');

  var data = {};
  if (e && e.parameter) data = e.parameter;

  var timestamp = new Date();
  var keys = Object.keys(data).filter(function(k){ return k.indexOf('_') !== 0; }).sort();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp'].concat(keys));
  }
  sheet.appendRow([timestamp].concat(keys.map(function(k){ return data[k] || ''; })));

  var subject = 'Build-A-Bong Lead Backup: ' + (data['Form Type'] || data['_subject'] || 'Website Form');
  var body = 'New Build-A-Bong website lead received.\n\n' + keys.map(function(k){
    return k + ': ' + (data[k] || '');
  }).join('\n');
  MailApp.sendEmail(adminEmail, subject, body);

  if (discordWebhook) {
    var content = '**New Build-A-Bong Lead**\n' + keys.slice(0, 20).map(function(k){
      return '**' + k + ':** ' + String(data[k] || '').substring(0, 500);
    }).join('\n');
    UrlFetchApp.fetch(discordWebhook, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({content: content}),
      muteHttpExceptions: true
    });
  }

  return ContentService.createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}

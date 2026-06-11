# Build-A-Bong Lead Delivery Setup

This package is wired so the website forms submit to:

`admin@pixies-pantry.com`

through FormSubmit.

## What is already set up in the HTML

- `quote.html` submits to `https://formsubmit.co/admin@pixies-pantry.com`
- `catalog.html` mini form submits to `https://formsubmit.co/admin@pixies-pantry.com`
- Both forms redirect to `thank-you.html`
- Both forms include a honeypot spam field
- Both forms include a backup lead-capture script that can also send a copy to Google Sheets / email / Discord once you add your Google Apps Script URL to `form-config.js`

## Important FormSubmit activation step

The first time someone submits to `admin@pixies-pantry.com`, FormSubmit may send a verification email to that inbox. Open that email and confirm it. Until that is confirmed, delivery may not be reliable.

## Backup system: Google Sheets + email + Discord

1. Create a Google Sheet named `Build-A-Bong Leads`.
2. Open Extensions > Apps Script.
3. Paste the contents of `GOOGLE_APPS_SCRIPT_BUILDABONG_LEADS.js`.
4. In Apps Script, go to Project Settings > Script Properties and add:
   - `ADMIN_EMAIL` = `admin@pixies-pantry.com`
   - `DISCORD_WEBHOOK_URL` = your private Discord webhook URL, optional
5. Deploy > New Deployment > Web App.
6. Execute as: Me.
7. Who has access: Anyone.
8. Copy the Web App URL.
9. Open `form-config.js` and replace the blank value:

```js
window.BUILDABONG_BACKUP_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

10. Re-upload `form-config.js` with the rest of the site.

## Test before advertising

Submit both forms with the word `TEST` in the name/message field. Confirm you receive:

- FormSubmit email
- Google Sheet row, if backup endpoint is configured
- Backup email from Apps Script, if configured
- Discord notification, if webhook is configured

Do not post your Discord webhook publicly. Keep it only inside Apps Script Properties, not inside website HTML.


## Current Google Apps Script Endpoint Added

The website backup endpoint is now set in `form-config.js`:

`https://script.google.com/macros/s/AKfycbxqgpyigHNO5ugEc5YyDv8uThn4CD_UoLPSWtmuxMGmtWBcwOotkVcE6jvbUOv2PCvB0Q/exec`

This endpoint receives a backup copy of quote form and catalog mini-form submissions. Keep the Discord webhook inside Google Apps Script Script Properties only. Do not commit Discord webhook URLs to GitHub.

After upload, submit a test quote and a test catalog color request, then confirm:

1. A row appears in Google Sheets.
2. An email arrives at `admin@pixies-pantry.com`.
3. A Discord alert posts if `DISCORD_WEBHOOK_URL` is set in Script Properties.
4. FormSubmit still sends the normal email/redirect.

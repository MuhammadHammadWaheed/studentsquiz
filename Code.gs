// ====== CONFIG ======
const SHEET_ID = "YOUR_SHEET_ID_HERE"; // put your Google Sheet ID here
const ADMIN_PASSWORD = "CHANGE_THIS_PASSWORD"; // teacher password (change it)

// ====== Web app entry ======
function doGet(e) {
  const page = e.parameter.page || 'index';
  if (page === 'teacher') {
    return HtmlService.createHtmlOutputFromFile('teacher').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } else {
    return HtmlService.createHtmlOutputFromFile('index').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

// ====== Called by client to save submission ======
function submitData(payload) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName('Submissions') || ss.insertSheet('Submissions');
    // Ensure header row exists
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Timestamp','Student Name','Quiz Code','Message']);
    }
    sh.appendRow([new Date(), payload.name, payload.code, payload.msg]);
    return {status: 'OK'};
  } catch (err) {
    return {status: 'ERROR', message: err.toString()};
  }
}

// ====== Called by teacher page to fetch submissions (password required) ======
function getSubmissions(password) {
  if (password !== ADMIN_PASSWORD) {
    return {status: 'UNAUTHORIZED'};
  }
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName('Submissions');
    if (!sh) return {status:'OK', rows: []};
    const data = sh.getDataRange().getValues(); // includes header
    // convert to objects
    const rows = data.slice(1).map(r => ({timestamp: r[0], name: r[1], code: r[2], msg: r[3]}));
    return {status: 'OK', rows: rows};
  } catch (err) {
    return {status: 'ERROR', message: err.toString()};
  }
}

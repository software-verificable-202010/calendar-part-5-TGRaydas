/* Main Module */

/* Import Requirments */
var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/calendar";
const viewConst = require('./js/viewConst.js');
let collection = null;

MongoClient.connect(dbUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db("calendar");
    collection = dbo.collection("events");
});

const {
    app,
    BrowserWindow,
    dialog
} = require('electron');
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {});
}

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    /* Rendering main view */
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'views/index.html'),
            protocol: 'file'
        })
    );
});

ipc.on('save-event', (event, args) => {
    let standardDate = "01/01/1970";
    console.log(viewConst.errorMessage, viewConst.titleErrorMessage)
    if(args.title === '') {
        dialog.showErrorBox(viewConst.errorMessage, viewConst.titleErrorMessage);
        return;
    }
    else if(Date.parse(`${standardDate} ${args.startTime}`) >= Date.parse(`${standardDate} ${args.endTime}`)){
        dialog.showErrorBox(viewConst.errorMessage, viewConst.timesErrorMessage)
        return;
    }
    else if(args.startTime == '' || args.endTime == ''){
        dialog.showErrorBox(viewConst.errorMessage, viewConst.timesErrorMessage)
        return;
    }
    collection.insertOne(args, (err, res) => {
        if (err) throw err;
    })
});

ipc.on('get-events', (event) => {
    collection.find({}).toArray((err, result) => {
        event.returnValue = result;
    });
})
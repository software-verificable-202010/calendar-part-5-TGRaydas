/* Main Module */

/* Import Requirments */
var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/calendar";

let collection = null;

MongoClient.connect(dbUrl, function(err, db) {
    if (err) throw err;
    var dbo = db.db("calendar");
    collection = dbo.collection("events");
});

const {
    app,
    BrowserWindow
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
    collection.insertOne(args, (err, res) => {
        if (err) throw err;
    })
});

ipc.on('get-events', (event) => {
    collection.find({}).toArray((err, result) => {
        event.returnValue = result;
    });
})
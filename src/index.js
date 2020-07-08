/* Main Module */

/* Import Requirments */
var MongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/calendar';
const viewConst = require('./js/viewConst.js');
let collection = null;
let users = null;
let mainWindow = null;
MongoClient.connect(dbUrl, function(err, db) {
	if (err) throw err;
	var dbo = db.db('calendar');
	collection = dbo.collection('events');
	users = dbo.collection('users');
});

const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcMain;
let loggedUser = null;
let selectedUser = null;

var createWindow = () => {
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
};

app.on('ready', () => createWindow());

ipc.on('is-logged', (event) => {
	event.returnValue = loggedUser;
});

ipc.on('log-in', (event, args) => {
	loggedUser = args.username;
	users.find({ username: args.username }).toArray((err, res) => {
		if (err) return;
		if (res[0] === undefined) {
			users.insertOne({ username: args.username }, () => {
				event.returnValue = true;
			});
		} else if (res[0].username != args.username) {
			users.insertOne({ username: args.username }, () => {
				event.returnValue = true;
			});
		} else {
			event.returnValue = true;
		}
	});
});

ipc.on('update-event', async (event, args) => {
	await collection.deleteOne({ id: args.eventID });
	args.username = loggedUser;
	await collection.insertOne(args, (err) => {
		if (err) throw err;
		event.returnValue = true;
	});
});

ipc.on('save-event', async (event, args) => {
	let standardDate = '01/01/1970';
	let newId = (await collection.find({}).count()) + 1;
	args.id = newId;
	if (args.title === '') {
		dialog.showErrorBox(viewConst.errorMessage, viewConst.titleErrorMessage);
		return;
	} else if (Date.parse(`${standardDate} ${args.startTime}`) >= Date.parse(`${standardDate} ${args.endTime}`)) {
		dialog.showErrorBox(viewConst.errorMessage, viewConst.timesErrorMessage);
		return;
	} else if (args.startTime == '' || args.endTime == '') {
		dialog.showErrorBox(viewConst.errorMessage, viewConst.timesErrorMessage);
		return;
	}
	args.username = loggedUser;
	collection.insertOne(args, (err) => {
		if (err) throw err;
		event.returnValue = true;
	});
});

ipc.on('get-events', async (event) => {
	let events = [];
	// GET LOGED USER EVENT
	collection.find({ username: loggedUser }).toArray((err, result) => {
		if (err) {
			return;
		}
		result.map((event) => {
			events.push(event);
		});
		collection.find({}).toArray((err, result) => {
			if (err) {
				return;
			}
			result.map((event) => {
				if (event.invited.includes(loggedUser)) {
					event.isInvited = true;
					events.push(event);
				}
			});
			collection.find({ username: selectedUser }).toArray((err, result) => {
				if (err) {
					return;
				}
				result.map((event) => {
					event.title += `: ${selectedUser}`;
					events.push(event);
				});
				collection.find({}).toArray((err, result) => {
					if (err) {
						return;
					}
					result.map((event) => {
						if (event.invited.includes(selectedUser)) {
							event.isInvited = true;
							event.title += ` : ${selectedUser}`;
							events.push(event);
						}
					});
					event.returnValue = events;
				});
			});
		});
	});
});

ipc.on('delete-event', (event, args) => {
	collection.deleteOne({ id: args.eventID }, () => {
		event.returnValue = true;
	});
});

ipc.on('add-user-calendar', (event, args) => {
	selectedUser = args.username;
	event.returnValue = true;
});

ipc.on('get-users', (event) => {
	users.find({}).toArray((err, result) => {
		if (err) {
			return;
		}
		let usersToInvite = result.filter((user) => {
			return user.username != loggedUser;
		});
		event.returnValue = usersToInvite;
	});
});

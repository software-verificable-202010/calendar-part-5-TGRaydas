/* Main Module */

/* Import Requirments */

const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

if (process.env.NODE_ENV !== 'production') {
	require('electron-reload')(__dirname, {});
}

app.on('ready', () => {
	mainWindow = new BrowserWindow({});
	/* Rendering main view */
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'views/index.html'),
			protocol: 'file'
		})
	);
});

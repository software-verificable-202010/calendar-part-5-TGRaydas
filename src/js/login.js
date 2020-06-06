const viewConst = require('../js/viewConst');
const ipc = require('electron').ipcRenderer;
const dialog = require('electron').dialog;

var login = (document, generateCalendar) => {
	document.getElementById(viewConst.loginContainerID).style.display = 'none';
	document.getElementById(viewConst.calendarContainerID).style.display = 'block';
	let username = document.getElementById(viewConst.usernameLoginID).value;
	ipc.sendSync('log-in', {
		username: username
	});
	generateCalendar(document);
};

module.exports = {
	login: login
};

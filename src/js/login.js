const viewConst = require('../js/viewConst');
const ipc = require('electron').ipcRenderer;

var changeUsersCalendar = (document) => {
	let showClass = ' show';
	let elementClassName = document.getElementById(viewConst.dropDownMenu).className;
	console.log(elementClassName);
	if (elementClassName.includes(showClass)) {
		document.getElementById(viewConst.dropDownMenu).className = elementClassName.split(' ')[0];
	} else {
		document.getElementById(viewConst.dropDownMenu).className += showClass;
	}
};

var changeCalendar = (generateCalendar) => {
	let elementClassName = document.getElementById(viewConst.dropDownMenu).className;
	document.getElementById(viewConst.dropDownMenu).className = elementClassName.split(' ')[0];
	ipc.sendSync('add-user-calendar', getLogInObject(event.toElement.innerText));
	generateCalendar(document);
};

var selectUsersCalendar = (document, generateCalendar) => {
	Array.from(document.getElementsByClassName(viewConst.dropDownItemClass)).map((element) => {
		element.addEventListener('click', (event) => changeCalendar(generateCalendar, event));
	});
};

var getLogInObject = (username) => {
	let logInObject = { username: username };
	return logInObject;
};

var login = (document, generateCalendar) => {
	document.getElementById(viewConst.loginContainerID).style.display = 'none';
	document.getElementById(viewConst.calendarContainerID).style.display = 'block';
	let username = document.getElementById(viewConst.usernameLoginID).value;
	ipc.sendSync('log-in', getLogInObject(username));
	generateCalendar(document);
};

module.exports = {
	login: login,
	getLogInObject: getLogInObject,
	changeUsersCalendar: changeUsersCalendar,
	selectUsersCalendar: selectUsersCalendar
};

let calendarType = 0;

const viewConst = require('../js/viewConst');
const ipc = require('electron').ipcRenderer;
const startWeekCalendar = require('../js/weekCalendar.js').startWeekCalendar;
const startMonthCalendar = require('../js/monthCalendar.js').startMonthCalendar;
const modalButtonsEvents = require('../js/addEvent.js').modalButtonsEvents;
const changeToNextWeek = require('../js/weekCalendar.js').changeToNextWeek;
const changeToPrevWeek = require('../js/weekCalendar.js').changeToPrevWeek;
const changeToPrevMonth = require('../js/monthCalendar.js').changeToPrevMonth;
const changeToNextMonth = require('../js/monthCalendar.js').changeToNextMonth;
const login = require('../js/login.js').login;
const changeUsersCalendar = require('../js/login.js').changeUsersCalendar;
const selectUsersCalendar = require('../js/login.js').selectUsersCalendar;
let calendarStarted = false;
let logged = false;
var getUsers = () => {
	let users = ipc.sendSync('get-users');
	return users;
};

var getUsersDropdownValues = (users) => {
	let usersDropDownRows = [];
	users.map((user) => {
		let row = `<a class="dropdown-item" href="#">${user.username}</a>`;
		usersDropDownRows.push(row);
	});
	return usersDropDownRows;
};

var addRowsToDropDown = (document) => {
	let users = getUsers();
	console.log(getUsersDropdownValues(users));
	getUsersDropdownValues(users).map((row) => {
		document.getElementById(viewConst.dropDownMenu).innerHTML += row;
	});
};

var generateCalendar = (document) => {
	let loggedUser = ipc.sendSync('is-logged');
	if (loggedUser != null) {
		console.log('is-logged');
		document.getElementById(viewConst.loginContainerID).style.display = 'none';
		document.getElementById(viewConst.calendarContainerID).style.display = 'block';
		logged = true;
	}
	document.getElementById(viewConst.loginButtonID).addEventListener('click', () => {
		login(document, generateCalendar);
		logged = true;
	});
	if (!logged) return;
	if (!calendarStarted) {
		console.log('ADDING EVENTS');
		addRowsToDropDown(document);
		modalButtonsEvents(document, generateCalendar);
		selectUsersCalendar(document, generateCalendar);
		document.getElementById(viewConst.changeCalendarDropDownID).addEventListener('click', () => {
			changeUsersCalendar(document);
		});
		document.getElementById(viewConst.nextWeekID).addEventListener('click', () => changeToNextWeek(document));
		document.getElementById(viewConst.prevWeekID).addEventListener('click', () => changeToPrevWeek(document));

		document.getElementById(viewConst.nextMonthID).addEventListener('click', () => changeToNextMonth(document));
		document.getElementById(viewConst.prevMonthID).addEventListener('click', () => changeToPrevMonth(document));

		calendarStarted = !calendarStarted;
	}

	document.getElementById(viewConst.monthCalendarButtonID).addEventListener('click', () => {
		calendarType = 0;
		startMonthCalendar(document);
	});

	document.getElementById(viewConst.weekCalendarButtonID).addEventListener('click', () => {
		calendarType = 1;
		startWeekCalendar(document);
	});

	if (calendarType === 0) {
		startMonthCalendar(document);
	} else {
		startWeekCalendar(document);
	}
};

module.exports = {
	getUsersDropdownValues: getUsersDropdownValues
};

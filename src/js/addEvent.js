const viewConst = require('../js/viewConst');
const ipc = require('electron').ipcRenderer;
const dialog = require('electron').dialog;
var events = [];
var users = [];
let invitedUsers = [];
var getUsers = () => {
	users = ipc.sendSync('get-users');
};

var clearModal = (document) => {
	fillUsersTable(document);
	document.getElementById(viewConst.dateEventInputID).value = '';
	document.getElementById(viewConst.submitEventTypeID).value = '';
	document.getElementById(viewConst.eventID).value = '';
	document.getElementById(viewConst.startTimeInputID).value = '';
	document.getElementById(viewConst.endTimeInputID).value = '';
	document.getElementById(viewConst.titleEventInputID).value = '';
	document.getElementById(viewConst.descriptionEventInputID).value = '';
	Array.from(document.getElementsByClassName(viewConst.inviteCheckbox)).map((element) => {
		element.checked = false;
	});
};

var openModalAddEvents = (document) => {
	fillUsersTable(document);
	Array.from(document.getElementsByClassName(viewConst.hourBoxClass)).map((element) => {
		element.addEventListener('click', (event) => {
			clearModal(document);
			if (event.target.tagName === 'SPAN') return;
			document.getElementById(viewConst.modalID).style.display = 'block';
			document.getElementById(viewConst.submitEventTypeID).value = 'save';
			document.getElementById(viewConst.dateEventInputID).value = event.toElement.getAttribute('date');
		});
	});
	Array.from(document.getElementsByClassName(viewConst.dayBoxClass)).map((element) => {
		element.addEventListener('click', (event) => {
			if (event.target.tagName === 'SPAN') return;
			clearModal(document);
			document.getElementById(viewConst.modalID).style.display = 'block';
			document.getElementById(viewConst.submitEventTypeID).value = 'save';
			document.getElementById(viewConst.dateEventInputID).value = event.toElement.getAttribute('date');
		});
	});
};

var openEventsAddEventListener = (document, allEvents) => {
	let eventsCardsClass = 'badge';
	events = allEvents;
	Array.from(document.getElementsByClassName(eventsCardsClass)).map((element) => {
		if (element.getAttribute('invited') === 'true') {
			return;
		}
		element.addEventListener('click', (event) => {
			document.getElementById(viewConst.modalID).style.display = 'block';
			let index = element.getAttribute('index');
			setEvent(document, events[index], index);
		});
	});
};

var setEvent = (document, event, index) => {
	fillUsersTable(document);
	document.getElementById(viewConst.dateEventInputID).value = event.date;
	document.getElementById(viewConst.submitEventTypeID).value = 'update';
	document.getElementById(viewConst.eventID).value = index;
	document.getElementById(viewConst.startTimeInputID).value = event.startTime;
	document.getElementById(viewConst.endTimeInputID).value = event.endTime;
	document.getElementById(viewConst.titleEventInputID).value = event.title;
	document.getElementById(viewConst.descriptionEventInputID).value = event.description;
	invitedUsers = event.invited;
	Array.from(document.getElementsByClassName(viewConst.inviteCheckbox)).map((element) => {
		if (invitedUsers.includes(element.getAttribute('username'))) {
			element.checked = true;
		}
	});
};

var updateEvent = (document) => {};

var saveEvent = (document, reloadCalendar) => {
	let date = document.getElementById(viewConst.dateEventInputID).value;
	let startTime = document.getElementById(viewConst.startTimeInputID).value;
	let endTime = document.getElementById(viewConst.endTimeInputID).value;
	let title = document.getElementById(viewConst.titleEventInputID).value;
	let description = document.getElementById(viewConst.descriptionEventInputID).value;
	let badgeClass = viewConst.badgeClasses[Math.floor(Math.random() * viewConst.badgeClasses.length)];
	let action = document.getElementById(viewConst.submitEventTypeID).value;
	let saveAction = 'save';
	let updateAction = 'update';
	if (action === saveAction) {
		ipc.sendSync('save-event', {
			date: date,
			startTime: startTime,
			endTime: endTime,
			title: title,
			description: description,
			badgeClass: badgeClass,
			invited: invitedUsers
		});
		reloadCalendar(document);
	} else if (action === updateAction) {
		let eventID = document.getElementById(viewConst.eventID).value;
		ipc.sendSync('update-event', {
			eventID: events[eventID].id,
			date: date,
			startTime: startTime,
			endTime: endTime,
			title: title,
			description: description,
			badgeClass: badgeClass,
			invited: invitedUsers
		});
		reloadCalendar(document);
	}
};

var deleteEvent = (document, reloadCalendar) => {
	let eventID = document.getElementById(viewConst.eventID).value;
	ipc.sendSync('delete-event', {
		eventID: events[eventID].id
	});
	reloadCalendar(document);
};

var fillUsersTable = (document) => {
	getUsers();
	document.getElementById(viewConst.usersTable).innerHTML = '';
	users.map((user) => {
		let userRow = `<tr><td>${user.username}</td><td><input username="${user.username}"
						 class="${viewConst.inviteCheckbox}" type="checkbox"/></td</tr>`;
		document.getElementById(viewConst.usersTable).innerHTML += userRow;
	});
	Array.from(document.getElementsByClassName(viewConst.inviteCheckbox)).map((element) => {
		element.addEventListener('change', () => {
			if (element.checked) {
				invitedUsers.push(element.getAttribute('username'));
			} else {
				invitedUsers = invitedUsers.filter((value) => {
					return value != element.getAttribute('username');
				});
			}
		});
	});
};

var modalButtonsEvents = (document, reloadCalendar) => {
	var modal = document.getElementById(viewConst.modalID);
	document.getElementById(viewConst.deleteEventButtonID).addEventListener('click', () => {
		deleteEvent(document, reloadCalendar);
		console.log('reloading-calendar');
	});
	document.getElementById(viewConst.saveID).addEventListener('click', () => {
		saveEvent(document, reloadCalendar);
		modal.style.display = 'none';
	});
	document.getElementById(viewConst.closeID).addEventListener('click', () => {
		modal.style.display = 'none';
	});
};

module.exports = {
	openModalAddEvents: openModalAddEvents,
	modalButtonsEvents: modalButtonsEvents,
	openEventsAddEventListener: openEventsAddEventListener
};

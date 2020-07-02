const monthNames = require('../js/calendarConst').monthNames;
const weekDates = require('../js/calendarConst').weekDates;
const viewConst = require('../js/viewConst');
const calendarConst = require('../js/calendarConst');

const openModalAddEvents = require('../js/addEvent').openModalAddEvents;
const openEventsAddEventListener = require('../js/addEvent').openEventsAddEventListener;

const ipc = require('electron').ipcRenderer;

let events = [];
var getEvents = () => {
	events = ipc.sendSync('get-events');
};

var showArrows = (document) => {
	document.getElementById(viewConst.nextMonthID).style.display = 'block';
	document.getElementById(viewConst.prevMonthID).style.display = 'block';
	document.getElementById(viewConst.nextWeekID).style.display = 'none';
	document.getElementById(viewConst.prevWeekID).style.display = 'none';
};

let calendarMonth = 0;
let calendarYear = 0;
let containerID = '';

var getEventCard = (event, index) => {
	let card = `<span id='event' invited=${event.isInvited} index="${index}" class="${event.badgeClass}">${event.title}</span>`;
	return card;
};

var searchEventsInDate = (day, month, year, events) => {
	let boxEvents = [];
	let formatedStrBoxDate = `${parseInt(day)}-${month}-${year}`;
	events.map((event) => {
		if (event.date == formatedStrBoxDate) {
			boxEvents.push(event);
		}
	});
	return boxEvents;
};

var getDaysInMonth = (month, year) => {
	var date = new Date(year, month, 1);
	var days = [];
	while (date.getMonth() === month) {
		days.push(new Date(date));
		date.setDate(date.getDate() + 1);
	}
	return days;
};

var getMonthCard = (dayName, dayNumber, cardEventsHtml, backgroundColorClass, headerColorClass, cardDate) => {
	let card = `<div  class="${viewConst.dayBoxClass} card border-secondary mb-3 ${backgroundColorClass}"  style="width: 14.25%">
					<div date=${cardDate} class="card-header ${headerColorClass} text-white">${dayName} ${dayNumber}</div>
					<div date=${cardDate} class="card-body text-secondary">
						${cardEventsHtml}
					</div>
				</div>`;
	return card;
};

/* Add to calendar container, days card view */

var renderMonthCalendarCard = (document, dayName, dayNumber, month, year, dayDate) => {
	/* Define day card view */
	/* Change styling depending of day week */
	let backgroundColorClass = viewConst.backgroundWhiteClass;
	let headerColorClass = viewConst.monthBoxHeaderClass;

	if (dayName === calendarConst.satDayName || dayName === calendarConst.sunDayName) {
		headerColorClass = viewConst.monthBoxEndWeekDayHeaderClass;
	} else if ((dayName === calendarConst.emptyDayName) & (dayNumber === 5)) {
		headerColorClass = viewConst.monthBoxEndWeekDayHeaderClass;
		backgroundColorClass = viewConst.dayNotInMonthClass;
		dayNumber = '';
	} else if (dayName === calendarConst.emptyDayName) {
		backgroundColorClass = viewConst.dayNotInMonthClass;
		dayNumber = '';
	}
	let cardEvents = searchEventsInDate(dayNumber, month, year, events);
	let cardEventsHtml = '';
	cardEvents.map((event, index) => {
		cardEventsHtml += getEventCard(event, index);
	});
	let formatedDate = `${dayDate}-${month}-${year}`;
	let card = getMonthCard(dayName, dayNumber, cardEventsHtml, backgroundColorClass, headerColorClass, formatedDate);

	document.getElementById(viewConst.containerID).innerHTML += card;
};

var generateMonthCalendar = (month, year, document) => {
	let dates = getDaysInMonth(month, year);

	let offSetDay = weekDates[dates[0].toString().split(' ')[0]];
	/* Clean previus month calendar */
	document.getElementById(viewConst.containerID).innerHTML = '';

	for (var i = 0; i < offSetDay; i++) {
		renderMonthCalendarCard(document, calendarConst.emptyDayValue, i);
	}

	dates.map((date) => {
		var dayName = date.toString().split(' ')[0];
		var dayNumber = date.toString().split(' ')[2];
		var dayDate = date.getDate();
		renderMonthCalendarCard(document, dayName, dayNumber, month, year, dayDate);
	});
	openModalAddEvents(document);
	openEventsAddEventListener(document, events);
};

var setMonthTitle = (title, document) => {
	document.getElementById(viewConst.monthTitleID).innerHTML = title;
};

var changeToNextMonth = (document) => {
	let decemberValue = 11;
	if (calendarMonth === decemberValue) {
		calendarMonth = 0;

		calendarYear++;
	} else {
		calendarMonth++;
	}

	setMonthTitle(monthNames[calendarMonth] + ' ' + calendarYear, document);

	generateMonthCalendar(calendarMonth, calendarYear, document);
};

var changeToPrevMonth = (document, innerID, monthTitleID) => {
	let decemberValue = 11;
	if (calendarMonth === 0) {
		calendarMonth = decemberValue;
		calendarYear--;
	} else {
		calendarMonth--;
	}

	setMonthTitle(monthNames[calendarMonth] + ' ' + calendarYear, document, monthTitleID);

	generateMonthCalendar(calendarMonth, calendarYear, document);
};

var startMonthCalendar = async (document) => {
	await getEvents();
	showArrows(document);
	document.getElementById(viewConst.weekHoursContainer).innerHTML = '';

	let today = new Date();
	calendarMonth = today.getMonth();

	calendarYear = today.getFullYear();
	document.getElementById(viewConst.containerID).innerHTML = '';
	setMonthTitle(monthNames[today.getMonth()] + ' ' + calendarYear, document);

	generateMonthCalendar(calendarMonth, calendarYear, document, containerID);
};

module.exports = {
	startMonthCalendar: startMonthCalendar,
	changeToPrevMonth: changeToPrevMonth,
	changeToNextMonth: changeToNextMonth,
	getEventCard: getEventCard,
	getMonthCard: getMonthCard,
	getDaysInMonth: getDaysInMonth,
	searchEventsInDate: searchEventsInDate
};

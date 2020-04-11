/* Day name to integer definition */
const weekDates = {
	Mon: 0,
	Tue: 1,
	Wed: 2,
	Thu: 3,
	Fri: 4,
	Sat: 5,
	Sun: 6
};

/* Global variables */
let calendarMonth = 0;
let calendarYear = 0;
let innerID = '';
let monthTitleID = '';

/* Month names ordered definition */
const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

/* Return an array with all days for a month in a defined year */
function getDaysInMonth(month, year) {
	var date = new Date(year, month, 1);
	var days = [];
	while (date.getMonth() === month) {
		days.push(new Date(date));
		date.setDate(date.getDate() + 1);
	}
	return days;
}

/* Add to calendar container, days card view */

var renderCalendarCard = (document, innerID, dayName, dayNumber) => {
	/* Define day card view */
	/* Change styling depending of day week */
	let backgroundColorClass = 'bg-white';
	let headerColorClass = 'bg-primary';
	/* If is a endweek day */
	if (dayName === 'Sat' || dayName === 'Sun') {
		headerColorClass = 'bg-success';
	} else if ((dayName === '.') & (dayNumber === 5)) {
		/* If is a day out of this month but is end of weekday */
		headerColorClass = 'bg-success';
		backgroundColorClass = 'bg-light bg-not-month';
		dayNumber = '';
	} else if (dayName === '.') {
		/* If is a day out of this month */
		backgroundColorClass = 'bg-light bg-not-month';
		dayNumber = '';
	}
	let card = `<div class="card border-secondary mb-3 ${backgroundColorClass}"  style="width: 14.25%">
                    <div class="card-header ${headerColorClass} text-white">${dayName} ${dayNumber}</div>
                    <div class="card-body text-secondary">
                        <h5 class="card-title"></h5>
                        
                    </div>
				</div>`;
	/* Add to calendar container day card */
	document.getElementById(innerID).innerHTML += card;
};

/* Generate the correct logic for a calendar month */
var calendar = (month, year, document, innerID) => {
	/* Get all dates in the speficic month */
	let dates = getDaysInMonth(month, year);
	console.log(month, year);
	/* Get the start month day number week off set */
	let offSetDay = weekDates[dates[0].toString().split(' ')[0]];
	/* Clean previus month calendar */
	document.getElementById(innerID).innerHTML = '';
	/* Render off set days */
	for (var i = 0; i < offSetDay; i++) {
		renderCalendarCard(document, innerID, '.', i);
	}
	/* Render validated month days */
	dates.map((date) => {
		var dayName = date.toString().split(' ')[0];
		var dayNumber = date.toString().split(' ')[2];
		renderCalendarCard(document, innerID, dayName, dayNumber);
	});
};

/* Set calendar title name */
var setMonthTitle = (title, document, monthTitleID) => {
	document.getElementById(monthTitleID).innerHTML = title;
};

/* Next month button pressed trigger function */
var nextMonth = (document, innerID, monthTitleID) => {
	/* If actual month is the last month of actual year */
	if (calendarMonth === 11) {
		/* Next month is the first of the next year */
		calendarMonth = 0;
		/* Next year */
		calendarYear++;
	} else {
		calendarMonth++;
	}
	/* Change calendar title */
	setMonthTitle(monthNames[calendarMonth] + ' ' + calendarYear, document, monthTitleID);
	/* Refresh calendar */
	calendar(calendarMonth, calendarYear, document, innerID);
};
/* Preview month button pressed trigger function */
var prevMonth = (document, innerID, monthTitleID) => {
	/* If actual month is the first of actual year */
	if (calendarMonth === 0) {
		/* Next month is lastest of preview year */
		calendarMonth = 11;
		calendarYear--;
	} else {
		calendarMonth--;
	}
	/* Change calendar title */
	setMonthTitle(monthNames[calendarMonth] + ' ' + calendarYear, document, monthTitleID);
	/* Refresh calendar */
	calendar(calendarMonth, calendarYear, document, innerID);
};

/* Generate calendar logic */
var startCalendar = (document, innerID, prevID, nextID, monthTitleID) => {
	/* Get actual date */
	let today = new Date();
	/* Ser innerID to calendar days container id in main document */
	innerID = innerID;
	/* Define calendarMonth to actual month */
	calendarMonth = today.getMonth();
	/* Define clendarYear to actual year */
	calendarYear = today.getFullYear();
	setMonthTitle(monthNames[today.getMonth()] + ' ' + calendarYear, document, monthTitleID);
	/* Add click event listener to next month button */
	document.getElementById(nextID).addEventListener('click', () => nextMonth(document, innerID, monthTitleID));
	/* Add click event listener to preview month button */
	document.getElementById(prevID).addEventListener('click', () => prevMonth(document, innerID, monthTitleID));
	/* Generate calendar */
	calendar(calendarMonth, calendarYear, document, innerID);
};

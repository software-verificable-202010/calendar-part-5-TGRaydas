let calendarType = 0; // 0 = Month calendar, 1 = Week calendar

const viewConst = require('../js/viewConst');
const startWeekCalendar = require('../js/weekCalendar.js').startWeekCalendar;
const startMonthCalendar = require('../js/monthCalendar.js').startMonthCalendar;
const modalButtonsEvents = require('../js/addEvent.js').modalButtonsEvents;

var calendar = (document) => {
    modalButtonsEvents(document, calendar)
    document.getElementById("monthly").addEventListener('click', () => {
        startMonthCalendar(document);
    });

    document.getElementById("weekly").addEventListener('click', () => {
        startWeekCalendar(document);
    });

    if (calendarType === 0) {
        startMonthCalendar(document);
    } else {
        startWeekCalendar(document);
    }
}
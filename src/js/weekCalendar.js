const viewConst = require('../js/viewConst');
const calendarConst = require('../js/calendarConst')
const openModalAddEvents = require('../js/addEvent').openModalAddEvents;
const ipc = require('electron').ipcRenderer


let firstDayWeek = null;
let weekDayOffSet = null;
let events = [];


var showArrows = () => {
    document.getElementById(viewConst.nextMonthID).style.display = 'none'
    document.getElementById(viewConst.prevMonthID).style.display = 'none'
    document.getElementById(viewConst.nextWeekID).style.display = 'block'
    document.getElementById(viewConst.prevWeekID).style.display = 'block'
}


var getEvents = () => {
    events = ipc.sendSync('get-events')
    console.log(events)
}

var searchEventsInHourBox = (startHour, endHour, actualDate) => {
    let hourEvents = [];
    let formatedStartHour = startHour.toString() + ":00";
    let formatedEndHour = endHour.toString() + ":00";
    let dateStr = '01/01/01 ';
    let parsedBoxStartHour = Date.parse(dateStr + formatedStartHour)
    let parsedBoxEndHour = Date.parse(dateStr + formatedEndHour)
    events.map(event => {
        let parsedEventStartHour = Date.parse(dateStr + event.startTime);
        let parsedEventEndHour = Date.parse(dateStr + event.endTime);
        if (event.date != actualDate) {
            return;
        }
        if (parsedBoxStartHour >= parsedEventStartHour && parsedBoxEndHour <= parsedEventEndHour) {
            hourEvents.push(event);
        } else if (parsedBoxStartHour > parsedEventStartHour && parsedBoxEndHour < parsedEventEndHour) {
            hourEvents.push(event);
        }

    })
    return hourEvents;
}

var setMonthTitle = (title, document) => {
    document.getElementById(viewConst.monthTitleID).innerHTML = title;
};

var getDaysInWeek = (month, year) => {
    var curr = new Date; // get current date
    var first = firstDayWeek - weekDayOffSet + 1; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var dates = [];
    for (var day = first; day <= last; day++) {
        var date = new Date(curr.setDate(day)).toUTCString()
        dates.push(date.toString().replace(',', '').split(' '));
    }
    return dates
}
const weekDates = require('../js/calendarConst').weekDates;

var renderWeekCalendarCard = (document, events, id, bgClass) => {
    let card = `<div date='${id}' class="${viewConst.hourBoxClass} ${bgClass}">${events}</div>`
    document.getElementById(viewConst.containerID).innerHTML += card;
}

var renderWeekCalendarHours = (document) => {
    document.getElementById(viewConst.weekHoursContainer).innerHTML = '';
    for (let hour = 0; hour < 24; ++hour) {
        let card = `<div class="row align-items-start week-calendar-box-height">
                  		<p>${hour}hrs</p>
             		</div>`
        document.getElementById(viewConst.weekHoursContainer).innerHTML += card;
    }
}

var getEventCard = (event) => {
    let card = `<span class="badge badge-primary">${event.title}</span>`
    return card;
}


var weekCalendar = (month, year, document) => {
    getEvents();
    document.getElementById(viewConst.containerID).innerHTML = '';
    setMonthTitle(calendarConst.monthNames[calendarMonth] + ' ' + calendarYear, document);
    renderWeekCalendarHours(document)
    let weekDates = getDaysInWeek(month, year)
    for (var day = 0; day < weekDates.length; day++) {
        renderWeekCalendarCard(document, weekDates[day][0] + ' ' + weekDates[day][1], '')
    }
    let endWeekDays = [parseInt(weekDates[weekDates.length - 1][1]),
        parseInt(weekDates[weekDates.length - 2][1])
    ]
    console.log(endWeekDays)
    let hour = 0;
    let weekDay = parseInt(weekDates[0][1]);
    for (let box = 0; box < 7 * 24; box++) {
        boxID = `${weekDay}-${month}-${year}`;
        let hoursEvents = searchEventsInHourBox(hour, hour + 1, boxID)
        let hourBoxEvents = '';
        hoursEvents.map(event => {
            hourBoxEvents += getEventCard(event)
        })
        let bgClass = '';
        if (endWeekDays.includes(weekDay)) {
            bgClass += viewConst.dayNotInMonthClass
            console.log(weekDay)
        }
        renderWeekCalendarCard(document, hourBoxEvents, boxID, bgClass)
        weekDay += 1
        if (weekDay == parseInt(weekDates[weekDates.length - 1][1]) + 1) {
            weekDay = parseInt(weekDates[0][1]);
        }
        if (box % 7 == 0 && box != 0) {
            hour++;
        }
    }
    openModalAddEvents(document);
}

var getDaysInMonth = (month, year) => {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

var setNextWeek = (document) => {
    firstDayWeek += 7
    const daysMonth = getDaysInMonth(calendarMonth, calendarYear);
    let lastMonthDay = daysMonth[daysMonth.length - 1].getDate();
    if (firstDayWeek > lastMonthDay) {
        firstDayWeek = firstDayWeek - lastMonthDay
        calendarMonth += 1
    }
    weekCalendar(calendarMonth, calendarYear, document);
}
var setPrevWeek = (document) => {
    firstDayWeek -= 7
    const daysMonth = getDaysInMonth(calendarMonth, calendarYear);
    let lastMonthDay = daysMonth[daysMonth.length - 1].getDate();
    let firstMonthDay = 1;
    if (firstDayWeek < firstMonthDay) {
        firstDayWeek = lastMonthDay
        calendarMonth -= 1
    }
    weekCalendar(calendarMonth, calendarYear, document);
}

var startWeekCalendar = (document) => {
    showArrows();
    let today = new Date();
    firstDayWeek = today.getDate()
    weekDayOffSet = today.getDay()
    /* Define calendarMonth to actual month */
    calendarMonth = today.getMonth();
    /* Define clendarYear to actual year */
    calendarYear = today.getFullYear();
    /* Add click event listener to next month button */
    document.getElementById(viewConst.nextWeekID).addEventListener('click', () => setNextWeek(document));
    /* Add click event listener to preview month button */
    document.getElementById(viewConst.prevWeekID).addEventListener('click', () => setPrevWeek(document));
    /* Generate calendar */
    weekCalendar(calendarMonth, calendarYear, document);
};

module.exports = {
    startWeekCalendar: startWeekCalendar
}
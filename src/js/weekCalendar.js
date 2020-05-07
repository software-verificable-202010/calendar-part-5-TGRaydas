const viewConst = require('../js/viewConst');
const calendarConst = require('../js/calendarConst')
const openModalAddEvents = require('../js/addEvent').openModalAddEvents;
const ipc = require('electron').ipcRenderer


let firstDayWeek = null;
let weekDayOffSet = null;
let events = [];
let monthNavigationValue = 1;

var showArrows = () => {
    document.getElementById(viewConst.nextMonthID).style.display = 'none'
    document.getElementById(viewConst.prevMonthID).style.display = 'none'
    document.getElementById(viewConst.nextWeekID).style.display = 'block'
    document.getElementById(viewConst.prevWeekID).style.display = 'block'
}


var getEvents = () => {
    events = ipc.sendSync('get-events')
}

var searchEventsInHourBox = (startHour, endHour, actualDate) => {
    let hourEvents = [];
    events.map(event => {
        if (event.date != actualDate) {
            return;
        }
        if(startHour >= parseInt(event.startTime.split(":")[0]) && endHour <= parseInt(event.endTime.split(":")[0])){
            hourEvents.push(event)
        }
        else if(startHour <= parseInt(event.endTime.split(":")[0]) && endHour >= parseInt(event.endTime.split(":")[0])){
            hourEvents.push(event)
        }

    })
    return hourEvents;
}

var setMonthTitle = (title, document) => {
    document.getElementById(viewConst.monthTitleID).innerHTML = title;
};

var getDaysInWeek = (month, year) => {
    var first = firstDayWeek + 1; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    var dates = [];
    var dayOfNextMonth = 1;
    var dayOfPrevMonthIndex = -1;
    for (var day = first; day <= last; day++) {
        var date = new Date(year, month, day).toUTCString()
        var daysInMonth = getDaysInMonth(month, year);
        if(day <= 0){
            var daysInPrevMonth = getDaysInMonth(month - 1, year);
            date = new Date(year, month - 1, daysInPrevMonth[daysInPrevMonth.length + day]).toUTCString()
        }
        else if(day > daysInMonth[daysInMonth.length - 1].getDate()){
            date = new Date(year, month + 1, dayOfNextMonth).toUTCString();
            dayOfNextMonth += 1;
        }
        else if(day < daysInMonth[0].getDate()){
            date = new Date(year, month - 1, daysInMonth[daysInMonth.length - dayOfPrevMonthIndex]).toUTCString();
            dayOfPrevMonthIndex -= 1;
        }
        dates.push(date.toString().replace(',', '').split(' '));
    }
    console.log(dates)
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
    let card = `<span class="${event.badgeClass}">${event.title}
                    <br/>${event.description}
                    <br/>${event.startTime}-${event.endTime}
                </span>`
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

var changeToNextWeek = (document) => {
    monthNavigationValue = 1
    firstDayWeek += 7
    const daysMonth = getDaysInMonth(calendarMonth, calendarYear);
    let lastMonthDay = daysMonth[daysMonth.length - 1].getDate();
    if (firstDayWeek >= lastMonthDay) {
        calendarMonth += 1
        if(calendarMonth > 11){
            calendarYear += 1
            calendarMonth = 0
        }
        firstDayWeek =  firstDayWeek - lastMonthDay
    }
    weekCalendar(calendarMonth, calendarYear, document);
}
var changeToPrevWeek = (document) => {
    monthNavigationValue = 0
    firstDayWeek -= 7
    const daysMonth = getDaysInMonth(calendarMonth, calendarYear);
    let lastMonthDay = daysMonth[daysMonth.length - 1].getDate();
    let firstMonthDay = 1;
    if (firstDayWeek < firstMonthDay) {
        calendarMonth -= 1
        if(calendarMonth < 0){
            calendarYear -= 1
            calendarMonth = 11
        }
        let datesNewMonth = getDaysInMonth(calendarMonth, calendarYear)
        firstDayWeek = datesNewMonth[datesNewMonth.length - 1].getDate() + firstDayWeek ;
    }
    weekCalendar(calendarMonth, calendarYear, document);
}

var startWeekCalendar = (document) => {
    showArrows();
    let today = new Date();
    firstDayWeek = today.getDate()
    weekDayOffSet = today.getDay()
    firstDayWeek = firstDayWeek - weekDayOffSet
    /* Define calendarMonth to actual month */
    calendarMonth = today.getMonth();
    /* Define clendarYear to actual year */
    calendarYear = today.getFullYear();
    /* Generate calendar */
    weekCalendar(calendarMonth, calendarYear, document);
};

module.exports = {
    startWeekCalendar: startWeekCalendar,
    changeToPrevWeek: changeToPrevWeek,
    changeToNextWeek: changeToNextWeek
}
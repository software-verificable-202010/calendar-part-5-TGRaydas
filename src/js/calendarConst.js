let janMonthName = 'January';
let febMonthName = 'February';
let marMonthName = 'March';
let aprMonthName = 'April';
let mayMonthName = 'May';
let junMonthName = 'June';
let julMonthName = 'July';
let augMonthName = 'August';
let sepMonthName = 'September';
let octMonthName = 'October';
let novMonthName = 'November';
let decMonthName = 'December';
let calendarMonth;
let calendarYear;
let satDayName = 'Sat';
let sunDayName = 'Sun';
let emptyDayName = ".";

const emptyDayValue = "."
const monthNames = [
    janMonthName,
    febMonthName,
    marMonthName,
    aprMonthName,
    mayMonthName,
    junMonthName,
    julMonthName,
    augMonthName,
    sepMonthName,
    octMonthName,
    novMonthName,
    decMonthName
];

/* Day name to integer definition */
let monDayValue = 0;
let tueDayValue = 1;
let wedDayValue = 2;
let thuDayValue = 3;
let friDayValue = 4;
let satDayValue = 5;
let sunDayValue = 6;

const weekDates = {
    Mon: monDayValue,
    Tue: tueDayValue,
    Wed: wedDayValue,
    Thu: thuDayValue,
    Fri: friDayValue,
    Sat: satDayValue,
    Sun: sunDayValue
};

module.exports = {
    monthNames: monthNames,
    weekDates: weekDates,
    emptyDayValue: emptyDayValue,
    calendarMonth: calendarMonth,
    calendarYear: calendarYear,
    satDayName: satDayName,
    sunDayName: sunDayName,
    emptyDayName: emptyDayName
}
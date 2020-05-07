const modalID = "event-modal";
const dateEventInputID = "event-date";
const titleEventInputID = "event-title";
const descriptionEventInputID = "event-description";
const hourBoxClass = "week-hour-box";
const weekHoursContainer = "week-calendar-hours";
const monthTitleID = "month-name";
const nextMonthID = "next";
const prevMonthID = "prev";
const nextWeekID = "next-week";
const prevWeekID = "prev-week"
const saveID = "save-event";
const closeID = "close-modal";
const containerID = "week-calendar-days";
const startTimeInputID = "event-start-time";
const endTimeInputID = "event-end-time";
const backgroundWhiteClass = 'bg-white';
const monthBoxHeaderClass = "bg-primary";
const monthBoxEndWeekDayHeaderClass = "bg-success"
const dayNotInMonthClass = "bg-light bg-not-month";
const dayBoxClass = "day-box-card";
const primaryBadgeClass = "badge badge-primary"
const secondaryBadgeClass = "badge badge-secondary"
const successBadgeClass="badge badge-success"
const dangerBadgeClass = "badge badge-danger"
const warningBadgeClass = "badge badge-warning"
const infoBadgeClass = "badge badge-info";
const lightBadgeClass = "badge badge-light";
const darkBadgeClass = "badge badge-dark";
const monthCalendarButtonID = "monthly";
const weekCalendarButtonID = "weekly";
const errorMessage = "Oops! Something went wrong!";
const timesErrorMessage = "Start time should be greater than end time!";
const titleErrorMessage = "The event must have a title.";


const badgeClasses = [
    primaryBadgeClass,
    secondaryBadgeClass,
    successBadgeClass,
    dangerBadgeClass,
    warningBadgeClass,
    infoBadgeClass,
    lightBadgeClass,
    darkBadgeClass,
]


module.exports = {
    modalID: modalID,
    dateEventInputID: dateEventInputID,
    titleEventInputID: titleEventInputID,
    descriptionEventInputID: descriptionEventInputID,
    hourBoxClass: hourBoxClass,
    weekHoursContainer: weekHoursContainer,
    monthTitleID: monthTitleID,
    nextMonthID: nextMonthID,
    prevMonthID: prevMonthID,
    containerID: containerID,
    closeID: closeID,
    saveID: saveID,
    startTimeInputID: startTimeInputID,
    endTimeInputID: endTimeInputID,
    prevWeekID: prevWeekID,
    nextWeekID: nextWeekID,
    dayBoxClass: dayBoxClass,
    monthBoxEndWeekDayHeaderClass: monthBoxEndWeekDayHeaderClass,
    monthBoxHeaderClass: monthBoxHeaderClass,
    dayNotInMonthClass: dayNotInMonthClass,
    badgeClasses: badgeClasses,
    monthCalendarButtonID: monthCalendarButtonID,
    weekCalendarButtonID: weekCalendarButtonID,
    errorMessage: errorMessage,
    timesErrorMessage: timesErrorMessage,
    titleErrorMessage: titleErrorMessage
}
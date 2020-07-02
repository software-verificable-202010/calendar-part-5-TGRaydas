const weekCalendar = require('../src/js/weekCalendar');

test('[getEventCard] return true', () => {
	let index = 3;
	let eventBadgeClass = 'red';
	let eventTitle = 'Clases';
	let event = {
		isInvited: true,
		badgeClass: eventBadgeClass,
		title: eventTitle,
		description: 'clases',
		startTime: '9:00',
		endTime: '10:00'
	};
	let shouldReturn = `<span index="${index}" invited=${event.isInvited} class="${event.badgeClass}">${event.title}
							<br/>${event.description}
							<br/>${event.startTime}-${event.endTime}
						</span>`;
	shouldReturn = shouldReturn.replace(/[\r\t\n]/g, '');
	let result = weekCalendar.getEventCard(event, index);
	result = result.replace(/[\r\t\n]/g, '');
	expect(result).toBe(shouldReturn);
});

test('[getDaysInWeek] return true', () => {
	let shouldReturn = [
		[ 'Wed', '01', 'Jul', '2020', '04:00:00', 'GMT' ],
		[ 'Thu', '02', 'Jul', '2020', '04:00:00', 'GMT' ],
		[ 'Fri', '03', 'Jul', '2020', '04:00:00', 'GMT' ],
		[ 'Sat', '04', 'Jul', '2020', '04:00:00', 'GMT' ],
		[ 'Sun', '05', 'Jul', '2020', '04:00:00', 'GMT' ],
		[ 'Mon', '06', 'Jul', '2020', '04:00:00', 'GMT' ],
		[ 'Tue', '07', 'Jul', '2020', '04:00:00', 'GMT' ]
	];
	let result = weekCalendar.getDaysInWeek(6, 2020);
	expect(result).toMatchObject(shouldReturn);
});

test('[searchEventsInHourBox] return true', () => {
	let startHour = 10;
	let endHour = 11;
	let actualDate = '06-10-2020';
	let events = [ { startTime: '10:20', endTime: '12:20', date: actualDate } ];
	let result = weekCalendar.searchEventsInHourBox(startHour, endHour, actualDate, events);
	expect(result).toMatchObject(events);
});

test('[getDaysInMonth] return true', () => {
	let year = 2020;
	let month = 6;
	let shouldReturn = [];
	let firstMonthDay = 1;
	let lastMonthDay = 31;
	for (let index = firstMonthDay; index < lastMonthDay + 1; index++) {
		shouldReturn.push(new Date(year, month, index));
	}
	let result = weekCalendar.getDaysInMonth(6, 2020);
	expect(result).toMatchObject(shouldReturn);
});

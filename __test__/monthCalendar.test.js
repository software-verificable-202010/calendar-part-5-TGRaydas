const monthCalendar = require('../src/js/monthCalendar');
const viewConst = require('../src/js/viewConst');
test('[getEventCard] return true', () => {
	let index = 3;
	let eventBadgeClass = 'red';
	let eventTitle = 'Clases';
	let event = {
		isInvited: true,
		badgeClass: eventBadgeClass,
		title: eventTitle
	};
	let shouldReturn = `<span id='event' invited=${event.isInvited} index="${index}" class="${event.badgeClass}">${event.title}</span>`;
	shouldReturn = shouldReturn.replace(/[\r\t\n]/g, '');
	let result = monthCalendar.getEventCard(event, index);
	result = result.replace(/[\r\t\n]/g, '');
	expect(result).toBe(shouldReturn);
});

test('[getMonthCard] return true', () => {
	let backgroundColorClass = 'grey';
	let cardDate = '2020-06-15';
	let headerColorClass = 'white';
	let dayName = 'Tue';
	let dayNumber = 4;
	let cardEventsHtml = '<span>Clases</span>';
	let shouldReturn = `<div  class="${viewConst.dayBoxClass} card border-secondary mb-3 ${backgroundColorClass}"  style="width: 14.25%">
							<div date=${cardDate} class="card-header ${headerColorClass} text-white">${dayName} ${dayNumber}</div>
							<div date=${cardDate} class="card-body text-secondary">
								${cardEventsHtml}
							</div>
						</div>`;
	shouldReturn = shouldReturn.replace(/[\r\t\n]/g, '');
	let result = monthCalendar.getMonthCard(
		dayName,
		dayNumber,
		cardEventsHtml,
		backgroundColorClass,
		headerColorClass,
		cardDate
	);
	result = result.replace(/[\r\t\n]/g, '');
	expect(result).toBe(shouldReturn);
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
	let result = monthCalendar.getDaysInMonth(6, 2020);
	expect(result).toMatchObject(shouldReturn);
});

test('[searchEventsInDate] return true', () => {
	let year = 2020;
	let month = 6;
	let day = 15;
	let events = [ { date: `${day}-${month}-${year}` }, { date: `${day + 1}-${month}-${year}` } ];
	let shouldReturn = [ { date: `${day}-${month}-${year}` } ];
	let result = monthCalendar.searchEventsInDate(day, month, year, events);
	expect(result).toMatchObject(shouldReturn);
});

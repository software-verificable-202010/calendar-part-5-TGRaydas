const addEvent = require('../src/js/addEvent');
const viewConst = require('../src/js/viewConst');
test('[getUsersRows] return true', () => {
	let users = [ { username: 'peter' }, { username: 'javier' } ];
	let shouldReturn = [];
	users.map((user) => {
		let userRow = `<tr><td>${user.username}</td><td><input username="${user.username}"
						class="${viewConst.inviteCheckbox}" type="checkbox"/></td</tr>`;
		shouldReturn.push(userRow);
	});
	let result = addEvent.getUsersRows(users);
	expect(result).toMatchObject(shouldReturn);
});

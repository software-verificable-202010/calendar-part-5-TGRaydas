const main = require('../src/js/main');
test('[getUsersDropdownValues] return true', () => {
	let users = [ { username: 'peter' }, { username: 'javier' } ];
	let shouldReturn = [];
	users.map((user) => {
		let userRow = `<a class="dropdown-item" href="#">${user.username}</a>`;
		shouldReturn.push(userRow);
	});
	let result = main.getUsersDropdownValues(users);
	expect(result).toMatchObject(shouldReturn);
});

const login = require('../src/js/login');
const viewConst = require('../src/js/viewConst');
test('[getLogInObject] return true', () => {
	let username = 'peter';
	let shouldReturn = { username: username };
	let result = login.getLogInObject(username);
	expect(result).toMatchObject(shouldReturn);
});

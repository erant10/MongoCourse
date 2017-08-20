// tester for validating records

const assert = require('assert');
// a 'Class' of User
const User = require('../src/user');

describe('Validating records', () => {

	it('requires a user name', () => {
		// validate that a username was provided
		const user = new User({ name: undefined });
		// validateSync is synchronous method that return the result immediately
		const validationResult = user.validateSync();
		// ES6 code equivalent to:
		// const message = validationResult.errors.name.message;
		const {message} = validationResult.errors.name;
		
		assert(message === 'Name is required.')
	});

	it('requires a username longer than 2 characters', () => {
		// validate that a username has more than 2 characters
		const user = new User({ name: 'Al' });
		const validationResult = user.validateSync();
		const {message} = validationResult.errors.name;
		
		assert(message === 'Name must be longer than 2 characters.');
	});

	it('disallows invalid records from being saved', (done) => {
		// validate that a username has more than 2 characters
		const user = new User({ name: 'Al' });
		user.save()
			// user.save() should fail, so use .catch instead of .then
			.catch((validationResult) => {
				const {message} = validationResult.errors.name;
				assert(message === 'Name must be longer than 2 characters.');
				done();
			});
	});
});
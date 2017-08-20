// tester for deleting a model

const assert = require('assert');
// a 'Class' of User
const User = require('../src/user');

describe('Deleting a user', () => {
	let joe;

	// before each it(), create a user with the name of 'Joe' and save it in mongo 
	beforeEach((done) => {
		joe = new User({ name:'Joe' });
		joe.save()
			.then(() => done());
	});
	
	// assert that a delete operation was successful
	function assertRemove(operation, done) {
		operation // the operaation returns a promise
			.then(() => User.findOne({ name:'Joe' })) // also returns a Promise
			.then((user) => {
				// assert that the user was indeed removed by checking that findOne returned null
				assert(user === null);
				done();
			});

	}

	it('model instance remove', (done) => {
		// remove the instance of joe from the database
		assertRemove(joe.remove(), done);
	});

	it('class method remove', (done) => {
		// Remove a bunch of records with a given criteria
		assertRemove(User.remove({ name:'Joe' }), done);
	});

	it('class method finAndRemove', (done) => {
		// Remove the first record that matches a given criteria
		assertRemove(User.findOneAndRemove({ name:'Joe' }), done);
	});

	it('class method findByIdAndRemove', (done) => {
		// Remove a specific record with a given id. 
		assertRemove(User.findByIdAndRemove(joe._id), done);
	});


});
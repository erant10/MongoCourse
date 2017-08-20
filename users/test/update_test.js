// tester for updating a model

const assert = require('assert');
// a 'Class' of User
const User = require('../src/user');

describe('Updating records', () => {
	let joe;
	
	// before each it(), create a user with the name of 'Joe' and save it in mongo 
	beforeEach((done) => {
		joe = new User({name:'Joe', postCount:0});
		joe.save()
			.then(() => done());
	});

	// assert that an update operation was successful
	function assertName(operation, done) {
		// operation is a Promise
		operation
			.then(() => {
				// passing an empty object to find ({}) will return all the records in the collection
				User.find({})
					.then((users) => {
						// we expect there to be only one user and that user will have the name alex
						assert(users.length === 1);
						assert(users[0].name === 'Alex');
						done();
					});
			});
	}

	it('instance type using \'set\' and \'save\'', (done) => {
		// change one of the properties inside of a model instance
		joe.set('name', 'Alex');
		// set only updates the model instance locally. 
		// after all changes were made, use save() to apply them in the database
		assertName(joe.save(), done);
	});

	it('a model instance can update using \'update\'', (done) => {
		// update the instance property\ies immediately 
		assertName(joe.update({ name:'Alex' }), done);
	});
	
	it('a model class can update', (done) => {
		// update all the records that match a given criteria
		assertName(
			// Users.update: first argument is the criteria to find all records that match it
			// 				 second argument is an object with the properties we wish to update
			User.update({ name:'Joe' }, { name:'Alex' }),
			done
		);
	});
	
	it('a model class can update one record', (done) => {
		// update the first record that matches a given criteria
		assertName(
			// Users.findOneAndUpdate: first argument is the criteria to find all records that match it
			// 				 		   second argument is an object with the properties we wish to update
			User.findOneAndUpdate({ name:'Joe' }, { name:'Alex' }),
			done
		);
	});
	
	it('a model class can find a record with a id and update', (done) => {
		// Remove a specific record with a given id. 
		assertName(
			// Users.findByIdAndUpdate: first argument is the id of the record we want to update
			// 				 		   second argument is an object with the properties we wish to update
			User.findByIdAndUpdate(joe._id, { name:'Alex' }),
			done
		);
	});

	it('a user can have their likes incremented by 1', (done) => {
		// increment a number property of all the reecords that matche a specified criteria 
		User.update({ name: 'Joe' }, { $inc: { likes: 10 } })
			.then(() => User.findOne({ name: 'Joe' }))
			.then((user) => {
				assert(user.likes === 10);
				done();
			});
	})

	
});
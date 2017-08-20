// tester for creating a model

const assert = require('assert');
// a 'Class' of User
const User = require('../src/user');

describe('Creating records', () => {
	// if done is referenced it must be called
	it('saves a user',(done) => {
		// create a new instance of User. not actually saved in the DB
		const joe = new User({ name: 'Joe' });

		// now the the 'joe' instance has many methods attached to it by mongoose, one of which is 'save()'  
		// save returns a Promise
		joe.save()
			.then(() => {
				// has joe been saved successfully?
				// make an assertion for this test
				// mocha records all the results of assertions
				// isNew == true if joe exists only in the local environment
				//       == false if joe was saved in the DB
				assert(!joe.isNew);
				done();
			});
	});
});
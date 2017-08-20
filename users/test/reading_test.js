// tester for reading a model

const assert = require('assert');
// a 'Class' of User
const User = require('../src/user');

describe('Reading users out of the database', () => {
	// decalre the variable ahead of time so it can be referanced and modified later
	let joe, maria, alex, zach;

	// before each execution of this test, 
	// insert a user to the database so that the read function can be tested later
	beforeEach((done) => {
		joe = new User({name: 'Joe'});
		alex = new User({name: 'Alex'});
		maria = new User({name: 'Maria'});
		zach = new User({name: 'Zach'});
		
	Promise.all([maria.save(), joe.save(), alex.save(), zach.save()])
			// returned Promise
			.then(() => done());
	});

	// perform the query test
	it('finds all users with the name of joe', (done) => {
		// User.find(criteria): finds all the users that match the given criteria. (returns an array of records)
		User.find({name:'Joe'})
			.then((users) => {
				// assert that the first joe that was found is in fact the one created above
				// by comparing the _id of joe to the _id of the found object
				// _id from mongo is wrapped by an ObjectID. use toString() to get raw string.
				assert(users[0]._id.toString() === joe._id.toString());
				done();
			});
	});

	it('finds a user with a particular id',(done) => {
		// User.findOne(criteria): finds the first user that matches the given criteria. (returns a single record)
		User.findOne({_id:joe._id})
			.then((user) => {
				assert(user.name === 'Joe');
				done();
			});
	});

	it('can skip and limit the result set', (done) => {
		User.find({})
			// sort the results by name in ascending order
			.sort({ name: 1 }) // sort({ name: -1 }) will sort in decending order
			.skip(1)
			.limit(2)
			.then((users)=> {
				assert(users.length === 2);
				assert(users[0].name === 'Joe');
				assert(users[1].name === 'Maria');
				done();
			});
	});
});
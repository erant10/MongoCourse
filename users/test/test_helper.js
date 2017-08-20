const mongoose = require('mongoose');

// tell mongoose to use the default ES6 Proomise implementation instead of its internal implementation
mongoose.Promise = global.Promise;

// before recieves a function as an argument that will be executed before ALL the tests are executed
// mocha will pause the entire testing environment until the 'done' function is called
before ((done) => {
	mongoose.connect('mongodb://localhost/users_test');
	mongoose.connection
		// result event handlers. 
		// these events are part of mongoose library
		.once('open', () => { 
			// ready to run the first test
			done(); 
		})
		.on('error', (error) => {
			console.log('Warning', error);
		});
}); 

// beforeEach recieves a function as an argument that will be executed before each test is called
beforeEach((done) => {
	const {users, comments, blogposts} = mongoose.connection.collections;
	// drop all of the collections in the database
	// the drop accepts a callback function that is executed on completion
	users.drop(() => {
		comments.drop(() => {
			blogposts.drop(() => {
				// ready to run the next test
				done();
			});
		});
	});
});
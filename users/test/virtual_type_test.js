// tester for creating a virtual type inside a model

const assert = require('assert');
// a 'Class' of User
const User = require('../src/user');

describe('Virtual types', () => {

	it('postCount returns a number of posts', (done) => {
		const joe = new User({
			name: 'Joe',
			posts: [{ title: 'postTitle', body: 'postBody' }]
		});
		joe.save()
			.then(() => User.findOne({ name: 'Joe' }))
			.then((user) => {
				assert(user.postCount === 1);
				done();
			})
	});
});
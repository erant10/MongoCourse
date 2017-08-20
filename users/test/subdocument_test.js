// tester for sub documents in a model

const assert = require('assert');
const User = require('../src/user');

describe('Subdocuments', () => {

	it('can create a Subdocument', (done) => {
		const joe = new User({
			name: 'Joe',
			posts: [
				{ 
					title: 'Post Title',
					body: 'Post Body'
				}
			]
		});

		joe.save()
			.then(() => User.findOne({ name: 'Joe' }))
			.then((user) => {
				assert(user.posts[0].title === 'Post Title');
				assert(user.posts[0].body === 'Post Body');
				done();
			});
	});

	it('can adds new post to existing record', (done) => {
		const joe = new User({
			name: 'Joe',
			posts: []		
		});
		joe.save()
			.then(() => User.findOne({ name: 'Joe' }))
			.then((user) => {
				// append a new record to the subdocument
				user.posts.push({ title: 'New Post Title', body: 'New Post Body'})
				// in order to update a posts subdocument, the entire model (the user in this case) must be saved
				// add return so that the next then command can be chained to the promise that save() returns
				return user.save();
			})
			.then(() => User.findOne({ name: 'Joe' }))
			.then((user) => {
				assert(user.posts[0].title === 'New Post Title');
				assert(user.posts[0].body === 'New Post Body');
				done();
			});
	});


	it('can remove an existing Subdocument', (done) => {
		const joe = new User({
			name: 'Joe',
			posts: [
				{ 
					title: 'Post Title',
					body: 'Post Body'
				}
			]
		});

		joe.save()
			.then(() => User.findOne({ name: 'Joe' }))
			.then((user) => {
				const post = user.posts[0];
				// mongoose provides an api alternative to js 'spilce':
				post.remove();
				// add return so that the next then command can be chained to the promise that save() returns
				return user.save();
			})
			.then((user) => User.findOne({ name: 'Joe'}))
			.then((user) => {
				assert(user.posts.length === 0);
				done();
			})
	});
});
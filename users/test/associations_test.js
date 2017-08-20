const mongoose = require('mongoose');

const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
	let joe, blogPost, comment;

	beforeEach((done) => {
		joe = new User({ name: 'Joe' });
		blogPost = new BlogPost({ title: 'JS is Great', content:'Yes it really is...' });
		comment = new Comment({ content: 'Congrats on a great post' });

		// create a new association to the blogPost. similar to nested property.
		// mongoose pushes only the objectId instead of the entire model
		joe.blogPosts.push(blogPost);
		blogPost.comments.push(comment);
		// assign the comment to joe
		comment.user = joe;

		// save everything to the database 
		// since this is done asycroneously, we cant chain a .then() function to only one of the save()'s
		// instead, use Promise.all on an array of actions
		Promise.all([joe.save(),blogPost.save(),comment.save()])
			// .then is called only after all of the abouve are completed
			.then(() => done());
	});

	it('saves a relation between a user and a blogpost', (done) => {
		User.findOne({ name: 'Joe' })
			// populate is a modifier that assures that any references to other collections 
			// will be retrieved as the actual instnces, instead of just the object id
			// arguments: the name of the properties in this instance that hold references to other collections
			.populate('blogPosts')
			// .then() actually executes the query
			.then((user) => {
				assert(user.blogPosts[0].title === 'JS is Great');
				done();
			});
	});

	it('saves a full relation graph', (done) => {
		User.findOne({ name: 'Joe' })
			.populate({
				// inside of the user that we fetch, we want to recursively load this additional resource
				path: 'blogPosts',
				// inside of the path, attemtp to furthur load up any deeper nested associations
				populate: {
					path: 'comments',
					model: 'comment',
					populate: {
						path: 'user',
						model: 'user'
					}
				}
			})
			.then((user) => {
				assert(user.name === 'Joe');
				assert(user.blogPosts[0].title === 'JS is Great');
				assert(user.blogPosts[0].comments[0].content === 'Congrats on a great post');
				assert(user.blogPosts[0].comments[0].user.name === 'Joe');

				done();
			});
	});
});

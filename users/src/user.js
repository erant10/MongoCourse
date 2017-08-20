/// reqiure packages
const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

// create a subdocument schema for a post
const PostSchema = new Schema({
	title: String,
	body: String
});

/// create the DB schema
const UserSchema = new Schema({
	name: {
		type: String,
		// required: first argument is set to true if property is required
		// 			 second argumment is a user friendly message if the property wasnt provided
		required: [true, 'Name is required.'],
		// validate the input
		validate: {
			// validator recieves a boolean function
			validator: (name) => name.length > 2,
			// a user friendly message that is shown if the validator function returns false
			message: 'Name must be longer than 2 characters.'
		}
	},
	posts: [PostSchema],
	likes: {
		type: Number,
		default: 0
	},
	blogPosts: [{
		type: Schema.Types.ObjectId,
		ref: 'blogPost'
	}]
});

// define a virtual type by implementing a getter function that will be called and executed when the property is called
UserSchema.virtual('postCount').get(function() {
	// 'this' refers to the instance of the model that we are working on
	// if we used a anon. function (() => {}), then 'this' would not refer to the model instacne but to the whole file.
 	return this.posts.length;
});

// Define middleware: function that are executed before('pre') or after('post') a selcted event.
// in this case, when a user gets removed, cleanup all of the blogposts that are accosiated to that user.
UserSchema.pre('remove', function(next) {
	// this == joe
	const BlogPost = mongoose.model('blogPost');
	// it is NOT recommended to iterate over this.blogPosts.
	// instead we will use the $in query operator; 
	// this will look through all of the _ids in the Blogpost collection and delete only those that are in the array this.blogposts
	BlogPost.remove({ _id : { $in: this.blogPosts } })
		.then(() => next());
});

/// Create the model
// User does NOT represent a single user but it represents the ENTIRE user collection
// mongoose.model args: 
// 		-'user' is the collection name
// 		-UserSchema is the Schema object that we expect the collection to follow
const User = mongoose.model('user', UserSchema);

/// export the model
// enables access to the user collection instance when this module will be required in other places in the project
module.exports = User;



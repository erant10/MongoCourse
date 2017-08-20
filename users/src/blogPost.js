const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogPostSchema = new Schema({
	title: String,
	content: String,
	comments: [{ 
		// This will be an array of id's
		type: Schema.Types.ObjectId,
		// pass a reference to another collection so that mongo will know what model those id's represent
		ref: 'comment'
	}]
});

const BlogPost = mongoose.model('blogPost', blogPostSchema);
module.exports = BlogPost;
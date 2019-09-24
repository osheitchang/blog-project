const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({

  author : String,
  body: String,
  // posts: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
})



const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
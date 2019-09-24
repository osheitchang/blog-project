const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  username : String,
  email: String,
  password: String,
  posts: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
  profilePicture: String

})



const User = mongoose.model('User', userSchema);

module.exports = User;
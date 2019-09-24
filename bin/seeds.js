const mongoose = require('mongoose');
const User = require('../models/User');

mongoose
  .connect('mongodb://localhost/blog', {useNewUrlParser: true})
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`, x))
  .catch(err => console.error('Error connecting to mongo', err));


  

 User.create({
  username : 'Osheit',
  email: 'osheit@sample.com',
  password: 'samplepassword',
  // posts: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  profilePicture: 'ImgURL'

})
.then((result)=>{

  res.redirect('/')
  //its literally sending us to localhost:3000/books

})
.catch((err)=>{
  next(err);
})


//  Book.create({name: "Of Mice and Men"})
require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/User')
const uploadCloud = require('./config/cloudinary');



const app = express();
app.use(session({
  secret: "shhh-super-sectet-key",
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true,
  // store: new MongoStore({
  //   mongooseConnection: mongoose.connection,
  //   ttl: 24 * 60 * 60 // 1 day
  // })
}));

// app.use(flash());



app.use((req, res, next)=>{
  res.locals.theUser = req.session.currentuser;

  // res.locals.errorMessage = req.flash('error');

  next();
})


mongoose
  .connect('mongodb://localhost/blog', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


  app.use(session({
    secret: "our-passport-local-strategy-app",
    resave: true,
    saveUninitialized: true
  }));

//passport serializer to keep the data as small as possible in our session

  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });
  
  passport.use(new LocalStrategy((username, password, next) => {


    const salt  = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    
    
    
    
    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, hash)) {
        return next(null, false, { message: "Incorrect password" });
      }
  
      return next(null, user);
    });
  }));




  app.use(passport.initialize());
app.use(passport.session());

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
// app.use(bloggy(path.join(__dirname, 'public', 'images', 'Bloggy.png')));

// app.get('/', function(req, res){
//   res.sendFile(__dirname+'/public/images/bloggy.png'); // change the path to your index.html
// });

// app.use(express.static('/public/images')); 

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


app.use(express.static('./public/images'));

const index = require('./routes/index');
app.use('/', index);

// const login = require('/')
// app.use('/', login);

const userRoutes = require('./routes/user-routes');
app.use('/', userRoutes);


const adminRoutes = require('./routes/admin-routes'); 
app.use('/', adminRoutes);

const blogRoutes = require('./routes/blog-routes');
app.use('/', blogRoutes);


module.exports = app;
// module.exports = router;

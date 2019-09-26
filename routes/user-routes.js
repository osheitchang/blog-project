const express  = require('express');
const router   = express.Router();
const passport = require("passport");
const User     = require('../models/User');
const Blog     = require('../models/Blog');
const bcrypt   = require('bcryptjs');


router.get('/signup', (req, res, next)=>{

    res.render('user-views/signup')

})
// you can have routes with the same name if one is get and one is post

router.post('/signup', (req, res, next)=>{

    let admin = false;

    console.log('------------', admin)
    console.log(req.body)

    if(req.user){
        // here we check if someone is logged in 
        if(req.user.isAdmin){
            // and if someone if logged in we check if theyre an admin and if so we change the value of the variable to true
            admin = req.body.role? req.body.role : false
            // this is the same as 
            // if(req.body.role){
            //     admin= req.body.role
            // }
            // else{
            //     admin = false
            // }
        }
    }


    console.log('===========', admin)



    const username = req.body.theUsername;
    const password = req.body.thePassword;


    const salt  = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);


    User.create({
        username: username,
        password: hash,
        isAdmin: admin
    })
    .then((result)=>{

        res.redirect('/')

    })
    .catch((err)=>{
        next(err)
    })
})

router.get('/homepage',(req,res,next)=>{
    // console.log('this is req>>>>>>>>>>>>>>>',req)
    console.log('this is req --------------------------------------->>>', req)
    console.log(req.user)
    const user = req.user
    Blog.find()
    .then((allBlogs)=>{
        res.render('user-views/homepage', {blog: allBlogs, user: user})
    })
    .catch((err)=>{
        next(err)
    })
})


router.get('/login', (req, res, next)=>{

    res.render('user-views/login')

})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/homepage",
    failureRedirect: "/login",
    // failureFlash: true,
    passReqToCallback: true
  }))


  router.post('/logout', (req, res, next)=>{

    req.session.destroy();

    res.redirect('/');

})


router.get('/delete', (req, res, next)=>{

});


// router.post("/login", (req,res,next)=>{
//     let username = req.body.username
//     let password = req.body.password

//     User.find({username:username})
//     .then()
//         res.redirect('/homepage')
//     }
//     else{
//         res.redirect('/login')
//         console.log(">>>>>>>>>>>>>>>>>>>>> Login failed",username)}
        
        
//     })
    // .catch((err)=>{
    //     next(err)
    // })
    // if(CONDITION){
    //     res.render('/user-views/homepage')
    // } else{res.redirect('/login').then({})}
// })
    
    
    //passport.authenticate("local",^
    
    // successRedirect: "/",
    // failureRedirect: "/login",
    // failureFlash: true,
    // passReqToCallback: true
//   }));



router.get('/logout',(req, res, next)=>{

    req.logout();
    // passport has its own req.logout method for you because req.session.destroy() just wasn't easy enough

    res.redirect('/');

})


router.get('/secret', (req, res, next)=>{

    if(req.session.currentuser){
        res.render('user-views/secret', {theUser: req.session.currentuser})
    } else{
        res.redirect('/')
    }



})

router.get('/profile', (req, res, next)=>{
    res.render('user-views/profile');
})

router.post('/account/delete-my-account', (req, res, next)=>{

    User.findByIdAndRemove(req.user._id)
    .then(()=>{
        res.redirect('/')
    })
    .catch((err)=>{
        next(err)
    })

})


router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ]
    })
  );


  router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/books",
      failureRedirect: "/" // here you would redirect to the login page using traditional login approach
    })
  );




  router.post('/user/delete/:id', (req, res, next)=>{
    let id=req.params.id;
    User.findByIdAndRemove(id)
    .then((theUser)=>{
        req.logOut()
        res.redirect('/login')
    })
    .catch((err)=>{
        next(err)
    })
})


router.get('/user/update/:id',(req, res, next)=>{
    const user = req.user
    res.render('user-views/userUpdate', {user:user})
})


router.post('/user/update/:id',(req, res, next)=>{
    let id = req.params.id
    console.log(req.body)
    User.findByIdAndUpdate(id, {username: req.body.theUsername})
    .then(result=>{
        console.log(result)
        res.redirect('/homepage')
    })
    .catch((err)=>{
        next(err)
    })
    
})



//   router.get('/books/editbook/:id', (req, res, next)=>{
//     let id=req.params.id;

//     Book.findById(id)
//     .then((theBook)=>{
//         Author.find()
//         .then((allAuthors)=>{

//             allAuthors.forEach((eachAuthor)=>{
//                 if(eachAuthor._id.equals(theBook.author)){
//                     // we're not allowed to use === to compare IDs
//                     // just because mongoose wont let you
//                     // but instead they have their own method called .equals
                    
//                     eachAuthor.isTheChosenOne = true;
//                 }
//             })

//             res.render('book-views/edit', {book: theBook, authors:allAuthors})
//         })
//         .catch((err)=>{
//             next(err);
//         })
//     })
//     .catch((err)=>{
//         next(err)
//     })
// })


//loged in user routes




module.exports = router;
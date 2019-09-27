const express = require('express');
const router  = express.Router();
const Blog    = require('../models/Blog');
const passport = require("passport");

router.get('/create-new-blog', (req,res,next)=>{
  res.render('blog-views/new-blog')
})

router.post('/create-new-blog',(req,res,next)=>{

    // console.log('=-=-=--=--=', req.body)
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> the user ->',theUser)

    let title = req.body.theTitle;
    // let author = req.body.theBody;
    let author = req.user.username
    let image = req.body.theImage;
    let body = req.body.theBody;

    Blog.create({
        title: title,
        body: body,
        author: author,
        image: image
    })
    .then((result)=>{

        res.redirect('/homepage')
        //its literally sending us to localhost:3000/books

    })
    .catch((err)=>{
        // res.redirect('/login')
        next(err);
    })
})


router.post('/blog/delete/:id', (req, res, next)=>{
    let id = req.params.id;
    console.log('>>>>>>>>>>>>>>>',id)

    Blog.findByIdAndRemove(id)
    .then((result)=>{
        res.redirect('/homepage')
    })
    .catch((err)=>{
        next(err)
    })
})

router.get('/blog/update/:id',(req, res, next)=>{
    // const user = req.user
    let id = req.params.id
    console.log(id)
    console.log(req.user)
    Blog.findById(id)
    .then((result)=>{
        console.log(result)
      //  res.render('/blog-views')
        res.render('blog-views/blog-update',{blog: result})
    })
})

// router.get('/blog/update/:id',(req, res, next)=>{
//     let id = req.params.id
//     res.render('blog-views/blog-update',{blog: id})
// })



router.post('/blog/edit/:id', (req, res, next)=>{
    let id = req.params.id;
    console.log('>>>>>>>>>>>>>>>',id)

    Blog.findByIdAndUpdate(id)
    .then((result)=>{
        res.redirect('/login')
    })
    .catch((err)=>{
        next(err)
    })
})



router.post('/blog/update/:id',(req, res, next)=>{
    let id = req.params.id
    console.log(req.body)
    Blog.findByIdAndUpdate(id, {title: req.body.theTitle, body:req.body.theBody})
    .then(result=>{
        console.log(result)
        res.redirect('/homepage')
    })
    .catch((err)=>{
        next(err)
    })
    
})




//this will be the update route for the blog


// router.post('/books/delete/:id', (req, res, next)=>{
//     let id = req.params.id;

//     Book.findByIdAndRemove(id)
//     .then((result)=>{
//         res.redirect('/books')
//     })
//     .catch((err)=>{
//         next(err)
//     })
// })

module.exports = router;
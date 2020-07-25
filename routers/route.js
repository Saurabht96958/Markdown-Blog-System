const express = require('express');
const router = express.Router();
const User = require('./../models/users');
const Post = require('./../models/posts');

//User.hasMany(Post,{foreignKey : 'postId'});
Post.belongsTo(User,{foreignKey : 'userId'});
const db = require('./../config/database.js');


db.sync()
.then(()=>console.log('successfully sychronize'));

//routing home pages
router.get('/', async(req, res)=>{
  let articles = await Post.findAll();

  res.render('home',{articles});
});


//routing for User's post

router.get('/all', async(req, res)=>{
   let articles = await Post.findAll();
   if(req.session.loggedIn){
     res.render('allPost',{articles : articles, user : req.session.username, userId : req.session.userId});

   }else{
     res.render('home',{articles : articles});
   }
});

router.get('/new', (req, res)=>{

   res.render('new', {data : '', title : '', markdown: '', description:''});
});

router.post('/new', async(req, res)=>{
  let title = req.body.title;
  let description = req.body.description;
  let markdown = req.body.markdown;
  if(!title || !description || !markdown){
    res.render('new',{data : 'fill all fields carefully', title : title, markdown: markdown, description:description});
  }else{

    let newPost = await Post.create({
      title : title,
      description : description,
      markdown : markdown,
      userId : req.session.userId
    });
    console.log(newPost);
    res.redirect('/dashboard');
  }
});

//routing for read more
router.get("/readmore/:id",async(req, res)=>{
  let article = await Post.findOne({
    where : {
      id : req.params.id
    }
  });
  res.render('readMore',{article : article});
});
router.get("/edit/:id", async(req, res)=>{
  let article = await Post.findOne({where: {
    id: req.params.id
  }});
  if(article === null ){
    res.redirect('/');
  }else{
      res.render('edit', {article, data: ''});
    }
});

router.put("/update/:id", async(req, res)=>{

    let result = await Post.update({
    title : req.body.title,
    description : req.body.description,
    markdown : req.body.markdown
  },{
    where : {
      id : req.params.id
    }
  });
   if(result){
     console.log(result);
     res.redirect('/all');
   }else{
     res.redirect('/all');
  }
});

//deleting the post or articles

router.delete('/delete/:id', async(req, res)=>{
  let result = await Post.destroy({
    where : {id : req.params.id}
  });
  res.redirect('/dashboard');
});

//router for MyPost
router.get('/myPost/:id', async(req, res)=>{
  if(req.session.loggedIn){

    let articles = await Post.findAll({where: {
      userId: req.params.id
    }});
    if(articles){
      res.render('myPost',{articles, user: req.session.username,userId : req.session.userId});
    }else{
      res.redirect('/dashboard');
    }
  }else{
    res.redirect('/dashboard');
  }

});

//rendering signup page
router.get('/signup', (req, res)=>{
  res.render('signup',{data:''});
});

router.post('/signup', async(req, res)=>{
  let username = req.body.username;
  let email = req.body.email;
  let password1 = req.body.password1;
  let password2 = req.body.password2;
  if(!username || !email || !password1 || !password2){
    res.render('signup',{data:'fill all fiels carefully'});
  }else{
    if(password1 === password2 && password1.length>=6){

      let exist = await User.findAll({
        where : {email:email}

      });
      //console.log(exist);
      if(exist.length>0){
        res.render('signup',{data:'email already exists'});
      }else{
        let created = await User.create({
          username : username,
          email : email,
          password : password1
        });
        if(created){
          res.render('signup',{data:'Account successfully created'});
        }else{
          res.render('signup',{data:'failed, something went wrong'});
        }
      }
    }else{
      res.render('signup',{data : 'password should be at least 6 digits/number'});
    }
  }
 });

 //login pages
 router.get('/login', (req,res)=>{
   res.render('login',{data : ''});
 });

 router.post("/login", async(req, res)=>{
   let email = req.body.email;
   let password = req.body.password;
   //console.log(email, password);
   if(!email || !password){
      res.render('login',{data : 'invalid emal or password'});
   }else{

     let exist = await User.findOne({
       where : {
         email:email,
         password : password
       }
     });
     if(exist === null){
       res.render('login',{data : 'invalid emal or password'});
     }else{
       req.session.loggedIn = true;
       req.session.userId = exist.id;
       req.session.username = exist.username;
       req.session.email = exist.email;

       res.redirect('/dashboard');
     }
  }
 });

//dashboard
 router.get('/dashboard', async(req, res)=>{
   if(req.session.loggedIn){
     let articles = await Post.findAll();
     res.render('allPost',{articles : articles, user : req.session.username, userId : req.session.userId});
   }else{
     res.render('dashboard',{data : 'please login!'});
   }
 })
 router.get('/logout', (req, res)=>{
   req.session.loggedIn = false;
   res.redirect('/login');
 });





module.exports= router;

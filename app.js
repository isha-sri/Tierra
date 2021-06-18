require('dotenv').config()
const express =require("express");
const bodyParser= require("body-parser");
const ejs = require("ejs");
const passport = require('passport');
const passportSell = require('passport');
const cookieSession = require('cookie-session')
require('./passport');
const app= express();
var _ = require('lodash');

const Cloudant = require("@cloudant/cloudant");
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.urlencoded({
  extended: true
}));

let name="";
let pic="";

app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2']
}))



app.set('view engine', 'ejs');
app.use(express.static("public"));

const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req,res){
  res.render("splashScreen");
})

app.get("/home", function(req, res){
  res.render("home");
})
// app.get("/shop/", function(req, res){
//   res.render("shop");
// })
app.get("/ourteam", function(req, res){
  res.render("ourteam");
})
// app.get("/itemDetails/", function(req, res){
//   res.render("itemDetails");
// })
app.get("/success", function(req, res){
  res.render("success", {name: req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value});
})
app.get("/cart", function(req, res){
  res.render("cart", {name: req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value});
})
app.get("/sell", function(req, res){
  res.render("sell");
})
app.get("/sellform", function(req, res){
  res.render("sellform");
})
app.get("/payment", function(req, res){
  res.render("payment", {name: req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value});
})
app.get("/address", function(req, res){
  res.render("address", {name: req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value});
})
// For shopping
app.get('/shop', (req, res) => res.render('login'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))


app.get('/good', isLoggedIn, (req, res) =>{

  cloudant();
  async function cloudant(){
    try{
      console.log("Creating connection with cloudant");
      const cloudant = Cloudant({
        url:"https://apikey-v2-30antvp518qnsh4ux4q2218mk91575x2m0p4roj9etbq:3965297d74db5784786a8e3ba733ab15@b68c0960-fa04-4283-be08-958102c4c93b-bluemix.cloudantnosqldb.appdomain.cloud",
        plugins: {
          iamauth:{
            iamApiKey : "dXx8hWWm2oEoYffAXHT39ybXWmD_irXNuvJRubOrAmNo"
          }
        }
      })
    console.log("Getting cloudant dbs...");
    const allDBS = await cloudant.db.list();
    console.log(allDBS);
    const db = cloudant.db.use("customer-info");
    let res="";

    db.find({selector:{email:req.user.emails[0].value}}, function(er, result) {
      if (result.docs.length) {
  console.log("Already exists");
  console.log(result);
  console.log(Object.keys(result).length);
  }else{
   console.log("new database created");
   cloudant();
   async function cloudant(){
     const customer_info = {
       "_id":uuidv4(),
       "name": req.user.displayName,
       "email": req.user.emails[0].value,
       "product_id": 8000,
       "qty": 10
     };
     res= await db.insert(customer_info);
     console.log("Added successfully to the database"+ res);
     console.log(res);
   }
  }
    });

  }catch(err){
    console.log(err);
  }
  }

  res.render("shop",{name:"Hello "+ req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})
name=  req.user.displayName;
pic=req.user.photos[0].value;
})

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/login', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

// For selling
// app.get('/sell', (req, res) => res.render('login-seller'))
// app.get('/failed', (req, res) => res.send('You Failed to log in!'))


// app.get('/good-seller', isLoggedIn, (req, res) =>{

//   res.render("sell",{name:"Hello "+ req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})
// })

// app.get('/auth/google-seller', passportSell.authenticate('google', { scope: ['profile', 'email'] }));

// app.get('/auth/google-seller/login-seller', passportSell.authenticate('google', { failureRedirect: '/failed' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/good-seller');
//   }
// );


app.get("/shop/catDetails/:item", function(req, res){
  var request = req.params.item;
  var price= req.body.price;
  console.log(price);
  console.log(request);
  console.log(name);
  res.render("catDetails", {name:"Hello " +name, pic:pic, catName:_.upperCase(request), image: "/images/IM3", image2:"/images/IM2"});
})

app.get("/shop/catDetails/:detail/itemDetails", function(req, res){
  res.render("itemDetails", {name:"Hello " +name, pic:pic, image:"/images/IM3.jpeg", image2:"/images/IM2.jpeg"});
})

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})

app.listen("3000", function(req, res){
  console.log("Server running on port 3000");
})

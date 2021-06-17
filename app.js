require('dotenv').config()
const express =require("express");
const bodyParser= require("body-parser");
const ejs = require("ejs");
const passport = require('passport');
const passportSell = require('passport');
const cookieSession = require('cookie-session')
require('./passport');
const app= express();

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


app.get("/", function(req, res){
  res.render("home");
})
// app.get("/shop/", function(req, res){
//   res.render("shop");
// })
app.get("/ourteam/", function(req, res){
  res.render("ourteam");
})
app.get("/itemDetails/", function(req, res){
  res.render("itemDetails");
})
app.get("/success/", function(req, res){
  res.render("success");
})
app.get("/cart/", function(req, res){
  res.render("cart");
})
app.get("/sell/", function(req, res){
  res.render("sell");
})
app.get("/sellform/", function(req, res){
  res.render("sellform");
})

// For shopping
app.get('/shop', (req, res) => res.render('login'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))


app.get('/good', isLoggedIn, (req, res) =>{

  res.render("shop",{name:"Hello "+ req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})
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

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})

app.listen("3000", function(req, res){
  console.log("Server running on port 3000");
})

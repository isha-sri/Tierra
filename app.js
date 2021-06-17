const express =require("express");
const bodyParser= require("body-parser");
const ejs = require("ejs");

const app= express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("home");
})
app.get("/shop/", function(req, res){
  res.render("shop");
})
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


app.get("/payment/", function(req, res){
  res.render("payment");
})
app.get("/splashScreen/", function(req, res){
  res.render("splashScreen");
})
app.listen("3000", function(req, res){
  console.log("Server running on port 3000");
})

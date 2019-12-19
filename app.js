// jshint esversion:8
// if(process.env.NODE_ENV !== "production"){
require("dotenv").config();
// }
const express = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const bcrypt =require("bcryptjs");
const flash = require("express-flash");
const session = require("express-session");
const override = require("method-override");
const app = express();
app.use(express.static("public"));

const passportInitialize = require("./passport-config");
passportInitialize(passport,
     email => user_details.find(user => user.email === email),
      id => user_details.find(user => user.id === id));

app.use(flash());
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave:false,
    save: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

const user_details = [];

app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine","ejs");
app.use(override("_method"));

app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/flims",(req,res)=>{
    res.render("flims");
});
app.get("/rating",(req,res)=>{
    res.render("rating");
});
app.get("/show",(req,res)=>{
    res.render("single");
});
app.get("/contact",(req,res)=>{
    res.render("contact");
});
app.get("/adminblog",(req,res)=>{
    res.render("adminblog");
});

app.get("/image",(req,res)=>{
    res.render("image");
});


app.get("/admin",checkNotAuth, (req,res)=>{
    res.render("admin");
});

app.get("/registration",checkNotAuth,(req,res)=>{
    res.render("registration");
});

app.get("/user",checkAuth,(req, res)=>{
    res.render("user", {user_details: user_details});
});

app.post("/admin",checkNotAuth, passport.authenticate("local",{
    successRedirect: "/user",
    failureRedirect: "/admin",
    failureFlash: true
}));

app.delete("/logout",(req, res)=>{
    req.logout();
    res.redirect('/admin');
});

app.post("/registration",checkNotAuth, async (req,res)=>{
    try {
        const hashPass = await bcrypt.hash(req.body.password, 10);
        user_details.push({
            id: Date.now().toString(),
            name: req.body.name,
            title: req.body.title,
            email: req.body.email,
            password:hashPass
        });
        res.redirect("/user");
    } catch (error) {
        res.redirect("/registration");
    }
});

function checkAuth(req, res, next) {  
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin');
}

function checkNotAuth(req, res, next) {  
    if(req.isAuthenticated()){
        return res.redirect('/user');
    }
    next();
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

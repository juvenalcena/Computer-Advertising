//jshint esversion:8
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Blog = require('../models/Blogposts');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => res.render('index'));

// Dashboard
router.get('/user', ensureAuthenticated, (req, res) =>
  res.render('user', {
    user: req.user
  })
);
//setting
router.get("/setting", (req, res)=> res.render("setting", {user: req.user}));
//edit
router.get("/edit", (req, res)=> res.render("edit", {user:req.user}));
//edit functionality
router.post("/edit", (req, res)=>{
  const {name, email} = req.body;
  const editId = { _id: req.body.id};
  const editItem = {$set:{name:name, email:email}};
  User.updateOne(editId, editItem, (err)=>{
    if(err){
      console.log(err);
    }else{
      res.redirect("/setting");
    }
  });
});

router.post("/delete", (req, res) => {
  const deleteItem = req.body.id;
  User.findByIdAndDelete(deleteItem, (err) => {
    if (!err) {
      console.log("Successfully deleted");
      console.log(deleteItem);
      req.flash("success_msg","Successfully Deleted account");
      res.redirect("/users/login");
    } else {
      console.log(err);
    }
  });
});
module.exports = router;

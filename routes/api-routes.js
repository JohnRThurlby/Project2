// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db

// Dependencies
// =============================================================

// Requiring our models
const db = require("../models"),
      postcode = require('postcode-validator'),
      validator = require("email-validator"),
      ValidatePassword = require('validate-password'),
      validPass = new ValidatePassword()
      
      

var express = require("express");


var events =

  [{
  title: "Placeholder event",
  image: "imgsrc",
  description: "this is the event description",
  start: "August 20, 2018",
  end: "August 21, 2018"
},
{
  title: "placeholder2",
  image: "image2",
  description: "description2",
  start: "start2",
  end: "end2"
}]

// Routes
// =============================================================
module.exports = function(app) {



  // GET route for getting a specific users
  app.get("/", function(req, res) {
    // findOne returns the entry from a table for a specific user
    db.Users.findOne({
      where: {
        id: req.params.userid
      }
    }).then(function(dbUsers) {
      // We have access to the users as an argument inside of the callback function
      // events.forEach(element => {
        res.render("index", {events: events[0]})
        
      // });

    })
  })
  
  // GET route for getting a specific users
  app.get("/api/users/", function(req, res) {
    // findOne returns the entry from a table for a specific user
    db.Users.findOne({
      where: {
        email: req.query.Email2,
        password: req.query.Password2
      }
    }).then(function(dbUsers) {
      console.log(dbUsers)
      if (dbUsers != null) {
      // We have access to the users as an argument inside of the callback function
         res.render("partials/feeds/feeds")
      }
      else {
        error = 'Invalid userid/password combination'
        var hbsObject = {error}
        console.log(hbsObject)
        res.render('index', hbsObject)
      }
      
    })
    
  })

  // GET route for getting a specific users events
  app.get("/api/userevents/:id", function(req, res) {
    // findAll returns all entries from the userevents table for a specific user
    db.Userevents.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(dbUserevents) {
      // We have access to the users events as an argument inside of the callback function
      res.json(dbUserevents)
    })
  })

  // GET route for getting a specific users likes
  app.get("/api/userlikes/:id", function(req, res) {
    // findAll returns all entries from the userlikes table for a specific user
    db.Userlikes.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(dbUserlikes) {
      // We have access to the users likes as an argument inside of the callback function
      res.json(dbUserlikes)
    })
  })

  // GET route for getting a specific users tags
  app.get("/api/usertags/:id", function(req, res) {
    // findAll returns all entries from the usertags table for a specific user
    db.Usertags.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(dbUsertags) {
      // We have access to the userstags as an argument inside of the callback function
      res.json(dbUsertags)
    })
  })
  
  // GET route for getting a specific category
  app.get("/api/categories/:id", function(req, res) {
    // findOne returns the entry from the category table based on id 
    db.Categories.findOne({  
    where: {
        id: req.params.id
      }
    }).then(function(dbCategories) {
      // We have access to the users as an argument inside of the callback function
      res.json(dbCategories)
    })
  })

  // GET route for getting all category
  app.get("/api/categories", function(req, res) {
    // findAll returns all the entries from the category table 
    db.Categories.findAll({}).then(function(dbCategories) {
      // We have access to the todos as an argument inside of the callback function
      res.json(dbCategories)
    })  
  })

  // POST route for saving a new user
  app.post("/api/users", function(req, res) {
    // create takes an argument of an object describing the user we want to
    // insert into our table. 
   
    var error = " "
    var userValid = true

    var passwordData = validPass.checkPassword(req.body.Password);
    if (!passwordData.isValid) {
      console.log(passwordData.isValid) // false
      console.log(passwordData.validationMessage)
      error = passwordData.validationMessage
      userValid = false
    }

    if (!validator.validate(req.body.Email)) {
      console.log('invalid email')
      error = 'Invalid email, please enter a correcty formatted email'
      userValid = false
       
    } 
    
    // added so user must enter a valid zip, call to zippopotam
    if (!postcode.validate(req.body.Zipcode, 'US')) {
          console.log('invalid zip')
          error = 'Zip Code is invalid'
          userValid = false 
    }
    
    if (userValid) {
      var n = req.body.Email.indexOf("@")   // determine position of @ sign
      var userid = req.body.Email.slice(0, n);  //split email to use for userid
      db.Users.create({
        userid: userid,        
        password: req.body.Password,          
        email: req.body.Email,  
        zipcode: req.body.Zipcode
      }).then(function(dbUsers) {
        // We have access to the new user as an argument inside of the callback function
        res.render("index")
      })
    }
    else {
      var hbsObject = {error}
      console.log(hbsObject)
      res.render('index', hbsObject)
    }  
  })

  // POST route for saving a new user tag
  app.post("/api/usertags", function(req, res) {
    // create takes an argument of an object describing the user tag we want to
    // insert into our table.
    db.Usertags.create({
      usertag: req.body.usertag
    }).then(function(dbUsertags) {
      // We have access to the new user tag as an argument inside of the callback function
      res.json(dbUsertags)
    })
  })

  // POST route for saving a new user event
  app.post("/api/userevents", function(req, res) {
    // create takes an argument of an object describing the user event we want to
    // insert into our table. 
    db.Userevents.create({
      eventtitle: req.body.eventtitle, 
      eventdesc: req.body.eventdesc,
      eventlocation: req.body.eventlocation, 
      eventstartdate: req.body.eventstartdate, 
      eventenddate: req.body.eventenddate,
      eventcapacity: req.body.eventcapacity, 
      eventpublic: req.body.eventpublic,
      eventprivate: req.body.eventprivate,
      eventcategoryid: req.body.eventcategoryid
    }).then(function(dbUserevents) {
      // We have access to the new user event as an argument inside of the callback function
      res.json(dbUserevents)
    })
  })

  // POST route for saving a new user like
  app.post("/api/userlikes", function(req, res) {
    // create takes an argument of an object describing the user like 
    db.Userlikes.create({
      liketitle: req.body.liketitle,
      likedesc: req.body.likedesc,
      likelocation: req.body.likelocation, 
      likestartdate: req.body.likestartdate,
      likeenddate: req.body.likeenddate,
      likesource:req.body.likesource      
    }).then(function(dbUserlikes) {
      // We have access to the new user event as an argument inside of the callback function
      res.json(dbUserlikes)
    })
  })
}


    
          




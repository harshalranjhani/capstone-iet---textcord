const User = require("../models/user");
const passport = require("passport");
const nodemailer = require("nodemailer");
const async = require("async");
const crypto = require("crypto");


module.exports.registerUser = async (req, res, next) => {
    try {
      const { email, username, password, firstName, lastName } = req.body;
      const user = new User({ email, username, firstName, lastName });
      const registeredUser = await User.register(user, password);
  
      let mailDetails = {
        from: "yelpcamp.alerts@gmail.com",
        to: email,
        subject: "Welcome to YelpCamp!",
        html: message,
      };
  
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log("Error Occurs", err);
        } else {
          console.log("Email sent successfully");
        }
      });
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  };
  
// jshint node : true
"use strict";

const EXPRESS = require("express");
const ALL_ROUTER = EXPRESS.Router();


// ! ============  GET ROUTES ============

// ! ============  POST ROUTES ============


ALL_ROUTER.post('/signup', (req, res) => {
      req.checkBody("user_name", "Name is required").notEmpty();
      req.checkBody("user_email", "Email is required").notEmpty();
      req.checkBody("user_password", "Password is required and should be:   min 5  & max 20  characters long.").isLength({
            min: 5,
            max: 20
      });
      req.checkBody("user_password_confirm", "Passwords do not match").equals(req.body.user_password);

      req.checkBody("", ""); //? checking the radio button

      let errors = req.validationErrors();
      if (errors) {
            let renderVar = {
                  page_title: "signudafdasp-form",
                  render_page: "./user_pages/user_signup",
                  errors: errors,
            };
            res.render("template", renderVar);
      } else {
            // depending on the value do dealer / buyer signup
      }
});




ALL_ROUTER.post('/login', (req, res) => {

      req.checkBody("username", "Name is required.").notEmpty();
      req.checkBody("password", "Password is required and should be:   min 5  & max 20  characters long.").isLength({
            min: 5,
            max: 20
      });

      let errors = req.validationErrors();
      if (errors) {
            let renderVar = {
                  page_title: "login-form",
                  render_page: "./user_pages/user_login",
                  errors: errors,
            };
            res.render("template", renderVar);
      } else {
            // depending on the value do dealer / buyer signup
      }

});

// ! ============  DELETE ROUTES ============


// ? ============  export router ============
module.exports = ALL_ROUTER;
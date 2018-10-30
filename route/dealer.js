// jshint node : true
"use strict";

const EXPRESS = require("express");
const DEALER_ROUTER = EXPRESS.Router();
const DealerModel = require("../models/dealer");
const Response = require("./response");

const BCRYPT_JS = require("bcryptjs");

// ! ============  GET ROUTES ============



DEALER_ROUTER.get('/logout', (req, res) => {
      req.logOut();
      req.flash("success", "Successfully loged out");
      res.redirect("/users/login");
});

// ! ============  POST ROUTES ============


DEALER_ROUTER.post('/signup', (req, res) => {
      console.log(`Dealer -> Signup  : ${req.body.username} , ${req.body.password}`);

      //* genereat a secure password
      let salt = BCRYPT_JS.genSaltSync(10);
      let securePass = BCRYPT_JS.hashSync(req.body.password, salt);

      //! crate a new Dealer and insert into collection
      let newDealer = new DealerModel({
            name: req.body.username,
            email: req.body.email,
            password: securePass,
            address: {
                  proper_address: req.body.address,
                  lat: 25.3176, //                          TODO : for now HARD-CODED
                  long: 82.9739,
            },
            rating: 3, //                                   TODO : hard coded, Buyer should be able to rate the dealer.
            no_of_people_rated: 124, //                     TODO : harcoded
            inbox: [],
            outbox: []
      });


      newDealer.save((err) => {
            if (err) {
                  return Response.error(res, [`Error : while registering a new Dealer \n ${err}`]);
            } else {
                  return Response.success(res, `Success, ${newDealer.name} registered successfully as a Dealer.`);
            }
      });

});




DEALER_ROUTER.post('/login', (req, res, next) => {

      console.log(`Dealer -> login  : ${req.body.email} , ${req.body.password}`);
      // console.log(req.body);


      // * match username
      let query = {
            email: req.body.email
      };

      DealerModel.findOne(query, (err, dealer) => {
            if (err) {
                  return Response.error(res, [`Error : while finding the Dealer in DB ${err}`]);
            }
            if (!dealer) {
                  return Response.error(res, [`Error : NO such user in Database`]);
            }

            //* compare password hashes
            let matched = BCRYPT_JS.compareSync(req.body.password, dealer.password);
            if (!matched) {
                  return Response.error(res, [`Error : Password does not match, retry !`]);
            }
            //* password matched
            // return Response.success(res, `Successfully loged in as a Dealer`); //! --> don't have much time sloppy code SORRY
            return Response.success(res, `${dealer._id}@${dealer.email}`);
            //  ? --->  don't put any gaps
      });

});




// ! ============  DELETE ROUTES ============



// ? ============  export router ============
module.exports = DEALER_ROUTER;
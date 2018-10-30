// jshint node : true
"use strict";

const EXPRESS = require("express");
const BUYER_ROUTER = EXPRESS.Router();
const BuyerModel = require("../models/buyer");
const Response = require("./response");

const BCRYPT_JS = require("bcryptjs");

// ! ============  GET ROUTES ============


BUYER_ROUTER.get("/hello", (req, res) => {
      console.log("hello hit");
      res.json({
            hey: "hello"
      });
});


BUYER_ROUTER.get('/logout', (req, res) => { // * I am not using it
      req.logOut();
      // req.flash("success", "Successfully loged out");
      res.redirect("/users/login");
});




// ! ============  POST ROUTES ============


BUYER_ROUTER.post('/signup', (req, res) => {
      console.log(`Buyer -> Signup  : ${req.body.username} , ${req.body.password}`);


      //* genereat a secure password
      let salt = BCRYPT_JS.genSaltSync(10);
      let securePass = BCRYPT_JS.hashSync(req.body.password, salt);

      //* creat a new Buyer and insert into collection
      let newBuyer = new BuyerModel({
            name: req.body.username,
            email: req.body.email,
            password: securePass,
            address: {
                  proper_address: req.body.address,
                  lat: 25.3176, //                                TODO : for now HARD-CODED
                  long: 82.9739,
            },
            inbox: [],
            outbox: []
      });


      newBuyer.save((err) => {
            if (err) {
                  return Response.error(res, [`Error : while registering a new buyer \n ${err}`]);
            } else {
                  return Response.success(res, `Success, ${newBuyer.name} registered successfully as a Buyer.`);
            }
      });

});



BUYER_ROUTER.post('/login', (req, res) => {
      console.log(`Buyer -> login  : ${req.body.email} , ${req.body.password}`);
      // console.log(req.body);

      // * match email --> as unique email is primary kay
      let query = {
            email: req.body.email
      };
      BuyerModel.findOne(query, (err, buyer) => {
            if (err) {
                  return Response.error(res, [`Error : while finding the Buyer in DB ${err}`]);
            }
            if (!buyer) {
                  return Response.error(res, [`Error : NO such user in Database`]);
            }

            //* compare password hashes
            let matched = BCRYPT_JS.compareSync(req.body.password, buyer.password);
            if (!matched) {
                  return Response.error(res, [`Error : Password does not match, retry !`]);
            }

            //* password matched
            // return Response.success(res, `Successfully loged in as a Buyer`);  //! --> don't have much time sloppy code SORRY
            return Response.success(res, `${buyer._id}@${buyer.email}`);

            //  ? --->  don't put any gaps
      });
});




// ! ============  DELETE ROUTES ============



// ? ============  export router ============
module.exports = BUYER_ROUTER;
// jshint node : true
"use strict";
const DATA_ROUTER = require("express").Router();


// ? bringing models
const BuyerModel = require("../models/buyer");
const DealerModel = require("../models/dealer");
// const CompanyModel = require("../models/company");


DATA_ROUTER.get("/", (req, res) => {
      res.send("hello testing");
});


DATA_ROUTER.get("/allDealers", (req, res) => { // ? so buyer/admin can see all the dealers, and clicking on one he can get specific
      //?                                             details of the dealer

      DealerModel.find({}, (err, dealers) => {
            if (err) {
                  res.statusMessage = "Error : while getting all dealers!";
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(dealers);
      });

});


DATA_ROUTER.get("/dealer/:id", (req, res) => { // ? detail of specific dealer, provided we have its id, -> get on login

      let id = req.params.id;
      DealerModel.findById(id, (err, dealer) => {
            if (err) {
                  res.statusMessage = `Error : while getting user with id ${id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(dealer);
      });

});



DATA_ROUTER.get("/dealer/{id}/[list of company for which he need to see car]", (req, res) => {

});

DATA_ROUTER.get("/car/{id}", (req, res) => { // ? detail of specific car

});



DATA_ROUTER.get("/getAllMessage_inbox/buyer/:_id", (req, res) => { // ? for BOTH buyer & dealer
      let id = req.params._id;

      BuyerModel.find({
            _id: id
      }, (err, buyer) => {
            if (err) {
                  res.statusMessage = `Error : while getting inbox messages for buyer with id ${id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(buyer[0].inbox);
            // res.send(buyer);
            // console.log(buyer);
            // console.log(buyer[0].name);
      });
});


DATA_ROUTER.get("/getAllMessage_outbox/buyer/:_id", (req, res) => { // ? for BOTH buyer & dealer
      let id = req.params._id;

      BuyerModel.find({
            _id: id
      }, (err, buyer) => {
            if (err) {
                  res.statusMessage = `Error : while getting outbox messages for buyer with id ${id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(buyer[0].outbox);
            // res.send(buyer);
            // console.log(buyer);
            // console.log(buyer[0].name);
      });


});



DATA_ROUTER.get("/getAllMessage_inbox/dealer/:_id", (req, res) => { // ? for BOTH buyer & dealer
      let id = req.params._id;

      DealerModel.find({
            _id: id
      }, (err, dealer) => {
            if (err) {
                  res.statusMessage = `Error : while getting inbox messages for dealer with id ${id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(dealer[0].inbox);
            // res.send(dealer);
      });

});


DATA_ROUTER.get("/getAllMessage_outbox/dealer/:_id", (req, res) => { // ? for BOTH buyer & dealer
      let id = req.params._id;

      DealerModel.find({
            _id: id
      }, (err, dealer) => {
            if (err) {
                  res.statusMessage = `Error : while getting inbox messages for dealer with id ${id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(dealer[0].outbox);
            // res.send(dealer);

      });

});

DATA_ROUTER.get("/getSpecificMessage/{Message_id}", (req, res) => { // ? for BOTH buyer & dealer


});



// db.company.aggregate({"$group":{"_id":null,"count":{"$sum":{"$size":"$cars"}}}})

module.exports = DATA_ROUTER;



//     /allDealers
//     /dealer/{id}
//     /dealer/{id}/allcars
//     /car/{id} --> car details    --> it will also have a link to the

//     /recommendation/{id}

//     /getMessage_inbox/{User_id}
//     /getMessage_outbox/{user_id}

//     /getMessage_inbox/{dealer_id}
//     /getMessage_outbox/{dealer_id}

//gettrending ---> will keep 15 cars in a map, that were  searchd, so as  /car/{id} --> this api is called will put the car_id in the map, and just loop over the map, and return all the car json object corrosponding to the car_id's

//    seach will be complicated

//     search?compnanies = [compnay_names , compnay_names]
//     eg. RESULS <<<<----- search?[bmw , ferari]
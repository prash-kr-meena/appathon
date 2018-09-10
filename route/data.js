// jshint node : true
"use strict";
const DATA_ROUTER = require("express").Router();


// ? bringing models
const BuyerModel = require("../models/buyer");
const DealerModel = require("../models/dealer");
const CompanyModel = require("../models/company");


DATA_ROUTER.get("/", (req, res) => {
      res.send("hello testing");
});




DATA_ROUTER.get("/allDealers", (req, res) => { // ? so buyer/admin can see all the dealers, and clicking on one he can get specific
      //?                                             details of the dealer

      console.log("hit -->   /allDealers  ");
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




// !--------------------------get cars for given options-------------------------------------

DATA_ROUTER.post("/cars_with_given_option", (req, res) => {

      let companies = req.body.companies;
      let transmission_type = req.body.transmission_type;
      let year = req.body.year;
      let color = req.body.color;
      let minPrice = req.body.minPrice;
      let maxPrice = req.body.maxPrice;

      console.log(req.body);

      CompanyModel.aggregate([{
            $match: {
                  company_name: {
                        $in: companies
                  }
            }
      }, {
            $unwind: "$cars"
      }, {
            $replaceRoot: {
                  newRoot: "$cars"
            }
      }, {
            $match: {
                  transmission_type: transmission_type,
                  color: color,
                  year: year,
                  PriceInINR: {
                        $gt: minPrice,
                        $lt: maxPrice
                  }
            }
      }], (err, desirex_cars) => {
            if (err) {
                  res.statusMessage = `Error : while getting desired Cars`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(desirex_cars);
      });

});


// we will get this from query, ie req.query
DATA_ROUTER.get("/dealer/{id}/[list of company for which he need to see car]", (req, res) => {

});

// !---------------------------------------------------------------



DATA_ROUTER.get("/car/:id", (req, res) => { // ? detail of specific car
      let car_id = req.params.id;

      CompanyModel.find({
            _id: car_id
      }, (err, dealer) => {
            if (err) {
                  res.statusMessage = `Error : while getting inbox messages for dealer with id ${car_id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(dealer[0].inbox);
            // res.send(dealer);
      });

});


DATA_ROUTER.get("/companies", (req, res) => {
      console.log("hit --> /companies");
      // db.companies.find({}, { _id: 0, company_name: 1 })

      CompanyModel.find({}, {
            _id: 0,
            company_name: 1
      }, (err, companyNames) => {
            if (err) {
                  res.statusMessage = `Error : while finding company names`;
                  res.status(400).end();
                  return;
            }
            res.send(companyNames);
      });
});


DATA_ROUTER.get("/car/:company_id/:id", (req, res) => { // ? detail of specific car
      let car_id = req.params.id;
      let company_id = req.params.company_id;

      CompanyModel.find({
            _id: company_id
      }, {
            cars: {
                  $elemMatch: {
                        _id: car_id
                  }
            }
      }, (err, car) => {
            if (err) {
                  res.statusMessage = `Error : while getting car with  car_id ${car_id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            // res.send(car);
            res.send(car[0].cars[0]);
      });

});






// ? ----------  get all message data - FOR Buyer & Dealer     BOTH   INBOX && OUTBOX   ----------



DATA_ROUTER.get("/getAllMessage_inbox/buyer/:_id", (req, res) => { // ? for BOTH buyer & dealer
      console.log("hit ---> /getAllMessage_inbox/buyer/:_id");
      let id = req.params._id;

      BuyerModel.find({
            _id: id
      }, (err, buyer) => {
            if (err) {
                  res.statusMessage = `Error : while getting ALL inbox messages for buyer with id ${id}`;
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
      console.log("hit ---> /getAllMessage_outbox/buyer/:_id");

      let id = req.params._id;

      BuyerModel.find({
            _id: id
      }, (err, buyer) => {
            if (err) {
                  res.statusMessage = `Error : while getting  ALL outbox messages for buyer with id ${id}`;
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
      console.log("hit ---> /getAllMessage_inbox/dealer/:_id");

      let id = req.params._id;

      DealerModel.find({
            _id: id
      }, (err, dealer) => {
            if (err) {
                  res.statusMessage = `Error : while getting ALL inbox messages for dealer with id ${id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(dealer[0].inbox);
            // res.send(dealer);
      });

});


DATA_ROUTER.get("/getAllMessage_outbox/dealer/:_id", (req, res) => { // ? for BOTH buyer & dealer
      console.log("hit ---> /getAllMessage_outobox/dealer/:_id");

      let id = req.params._id;

      DealerModel.find({
            _id: id
      }, (err, dealer) => {
            if (err) {
                  res.statusMessage = `Error : while getting ALL  inbox messages for dealer with id ${id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(dealer[0].outbox);
            // res.send(dealer);

      });

});










// ? ----------  get specific message data - FOR Buyer & Dealer      ----------


// ! not tested : as needed message_id --> but there is no message in our dealer database
DATA_ROUTER.get("/getSpecificMessage/dealer/inbox/:dealer_id/:inbox_message_id", (req, res) => { //

      let dealer_id = req.params.dealer_id;
      let message_id = req.params.inbox_message_id;

      DealerModel.find({
            _id: dealer_id
      }, {
            inbox: {
                  $elemMatch: {
                        _id: message_id
                  }
            }
      }, (err, message) => {
            if (err) {
                  res.statusMessage = `Error : while getting inbox messages for dealer with id ${message_id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(message);
      });
});

// ! not tested : as needed message_id --> but there is no message in our dealer database
DATA_ROUTER.get("/getSpecificMessage/dealer/outbox/:dealer_id/:outbox_message_id", (req, res) => { //

      let dealer_id = req.params.dealer_id;
      let message_id = req.params.outbox_message_id;

      DealerModel.find({
            _id: dealer_id
      }, {
            outbox: {
                  $elemMatch: {
                        _id: message_id
                  }
            }
      }, (err, message) => {
            if (err) {
                  res.statusMessage = `Error : while getting inbox messages for dealer with id ${message_id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(message);
      });
});




DATA_ROUTER.get("/getSpecificMessage/buyer/inbox/:buyer_id/:inbox_message_id", (req, res) => { //

      let buyer_id = req.params.buyer_id;
      let message_id = req.params.inbox_message_id;

      BuyerModel.find({
            _id: buyer_id
      }, {
            inbox: {
                  $elemMatch: {
                        _id: message_id
                  }
            }
      }, (err, message) => {
            if (err) {
                  res.statusMessage = `Error : while getting inbox messages for dealer with id ${message_id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(message);
      });
});


DATA_ROUTER.get("/getSpecificMessage/buyer/outbox/:buyer_id/:outbox_message_id", (req, res) => { //

      let buyer_id = req.params.buyer_id;
      let message_id = req.params.outbox_message_id;

      BuyerModel.find({
            _id: buyer_id
      }, {
            outbox: {
                  $elemMatch: {
                        _id: message_id
                  }
            }
      }, (err, message) => {
            if (err) {
                  res.statusMessage = `Error : while getting outbox messages for dealer with id ${message_id}`;
                  res.status(400).end();
                  return;
            }
            res.status(200);
            res.send(message);
      });
});





// ! post request to send message to the dealer

DATA_ROUTER.post("/sendMessage/to_buyer/:buyer_id", (req, res) => {
      console.log("hit --> /sendMessage/to_buyer/:buyer_id");

      let buyer_id = req.params.buyer_id; // ?

      console.log(buyer_id);
      // console.log(req.body);

      let inbox_message = {
            date: req.body.date,
            from: req.body.sender_email,
            message: req.body.message,
      };


      BuyerModel.findById(buyer_id, (err, buyer) => {
            if (err) {
                  res.statusMessage = `Error : while sending messages to buyer with id ${buyer_id}`;
                  res.status(400).end();
                  return;
            }
            // res.send(buyer);
            console.log(buyer); //! ---> insert in its inbox
            res.status(200);
            res.send("Successfull");
      });

      // res.status(200);
      // res.send("success hit");

});


DATA_ROUTER.post("/sendMessage/to_dealer/:dealer_id", (req, res) => {
      console.log("hit --> /sendMessage/to_dealer/:dealer_id");

      let dealer_id = req.params.dealer_id; // ?

      // console.log(dealer_id);
      console.log(req.body);

      let inbox_message = {
            date: req.body.date,
            from: req.body.sender_email,
            message: req.body.message,
      };

      console.log(inbox_message);

      DealerModel.findById(dealer_id, (err, dealer) => {
            if (err) {
                  res.statusMessage = `Error : while sending messages to buyer with id ${dealer_id}`;
                  res.status(400).end();
                  return;
            }
            // console.log(dealer); //! ---> insert in its inbox
            console.log("fond the Dealer ");


            let update_inbox_query = {
                  $push: {
                        inbox: [inbox_message]
                  }
            };

            let query = {
                  _id: dealer_id
            };


            DealerModel.updateOne({
                  query
            }, {
                  update_inbox_query
            }, (err) => {
                  if (err) {
                        res.statusMessage = `Error : while pushing message to dealers inbox `;
                        res.status(400).end();
                        return;
                  }

                  res.status(200);
                  res.send("Message successfully pushed in dealers mail");
            });
      });

      // res.status(200);
      // res.send("success hit");

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
// jshint node : true
"use strict";

const CSV_TO_JSON = require("csvtojson/v2"),
      FS = require('fs');

const google_maps_config = require("../config/google_maps");
const API_ROUTER = require("express").Router();



// db.users.createIndex( { "email": 1 }, { unique: true } );


const BuyerModel = require("../models/buyer");
const DealerModel= require("../models/dealer");

API_ROUTER.get('/add_buyer', (req, res) => {
      let buyer = new BuyerModel({
            name: "prashant",
            password: "jfalksdjlk;jasdl",
            email: "prashant@gmail.com",
            address: {
                  proper_address: "sarai kale khan",
                  lat: 28.588940,
                  long: 77.256920
            }
      });

      buyer.save((err) => {
            if (err) {
                  console.log(buyer.name + "NOT registered.");
                  // console.log(err);
            } else {
                  console.log("success  ->  ", buyer.name + " registered successfully.");
            }
      });

      //==================================================
      res.send("done");
});

API_ROUTER.get('/add_dealer', (req, res) => {
      let dealer = new DealerModel({
            name: "prashant",
            password: "jfalksdjlk;jasdl",
            email: "prashant@gmail.com",
            address: {
                  proper_address: "sarai kale khan",
                  lat: 28.588940,
                  long: 77.256920
            }
      });

      dealer.save((err) => {
            if (err) {
                  console.log(dealer.name + "NOT registered.");
                  // console.log(err);
            } else {
                  console.log("success  ->  ", dealer.name + " registered successfully.");
            }
      });

      //==================================================
      res.send("done");
});



API_ROUTER.get(`/map_view`, (req, res) => {

      let csv_file_path = "./test.csv";
      // let csv_file_path = "./VehicleInventoryData.csv";

      let array_Records_Object = [];

      promise_to_parseCSV(csv_file_path, res)
            .then((resolve_List) => {
                        console.log(`DONE : parsing teh CSV file`);

                        array_Records_Object = resolve_List;
                        // console.log(array_Records_Object);

                        res.render("map_view", {
                              config: google_maps_config,
                              array_Records_Object: JSON.stringify(array_Records_Object),
                        });
                  },
                  (reject_Error_message) => {
                        console.log(`Error : while parsing CSV  \n ${reject_Error_message} \n`);
                        throw new Error(reject_Error_message);
                  })
            .catch((e) => {
                  console.log(`EXCEPTION : while parsing CSV  \n ${e} \n`);
                  throw new Error(e);
            });
});


function promise_to_parseCSV(csv_file_path) { // * Parse large csv with stream / pipe(low mem consumption)

      let list = [];

      return new Promise((resolve, reject) => {

            let readableStream = FS.createReadStream(csv_file_path);

            CSV_TO_JSON()
                  .fromStream(readableStream)
                  .subscribe(function (jsonObj) { //       single json object will be emitted for each csv line
                        list.push(jsonObj); //             parse each json asynchronousely
                  })
                  .on('error', (err) => {
                        reject(err);
                  })
                  .on('done', () => {
                        resolve(list);
                  });
      });
}




module.exports = API_ROUTER;
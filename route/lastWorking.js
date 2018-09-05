// jshint node : true
"use strict";

const CSV_TO_JSON = require("csvtojson/v2"),
      FS = require('fs');

const google_maps_config = require("../config/google_maps");
const API_ROUTER = require("express").Router();
const BCRYPT_JS = require("bcryptjs");


// ? for parsing big JSON file
const PATH = require("path");
const BIG_JSON = require('big-json');


// ? bringing models
const BuyerModel = require("../models/buyer");
const DealerModel = require("../models/dealer");
const CompanyModel = require("../models/company");


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
                  console.log(dealer.name + "  NOT registered.   BUYER");
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
                  console.log(dealer.name + "  NOT registered.   DEALEAR");
                  // console.log(err);
            } else {
                  console.log("success  ->  ", dealer.name + " registered successfully.");
            }
      });

      //==================================================
      res.send("done");
});



API_ROUTER.get("/build/dealers", (req, res) => {
      save_dealers();
      // ----   insert dealers in the dealers collections --->>> making sure they all have unique emails

      function save_dealers() {
            let dealerList = require("./dealer.json");
            let dealer_size = dealerList.length;

            dealerList.forEach((dealer, index) => {
                  dealer.email = "bitBattle_2018_" + dealer.id + "_@myKarmaa.com";

                  let fixedpass = "000000";
                  let salt = BCRYPT_JS.genSaltSync();
                  let securePass = BCRYPT_JS.hashSync(fixedpass, salt);

                  let d = new DealerModel();
                  d.name = dealer.name;
                  d.password = securePass;
                  d.email = dealer.email;
                  d.rating = dealer.rating;
                  d.no_of_people_rated = dealer.numOfPEopleRated;
                  d.address = {
                        proper_address: "---enter your address---",
                        lat: dealer.latitude,
                        long: dealer.longitude,
                  };
                  d.inbox = [];
                  d.outbox = [];

                  // console.log(d);
                  d.save(d, (err) => {
                        if (err) {
                              console.log(err);
                              throw new Error("dealer not saved ");
                        }
                  });

                  if (dealer_size - 1 === index) {
                        setTimeout(() => {
                              console.log("==== all the dealers are added to the database ====");
                              res.send("done");
                        }, 6000);
                  }
            });
      }
});

API_ROUTER.get("/build/companies", (req, res) => {

      map_and_save_cars_in_garage();

      // ----   insert cars in the car_garage collections ---->>>> making sure they are mapped with the dealer
      function map_and_save_cars_in_garage() {
            console.log("start saving cars");

            const readStream = FS.createReadStream(PATH.join(__dirname, '/test.json'));
            const parseStream = BIG_JSON.createParseStream();

            parseStream.on('data', (pojo) => {
                  // => receive reconstructed POJO
                  for (let i in pojo) {
                        // console.log(pojo[i]);
                        let carRecord = pojo[i];

                        let company_name = carRecord.make.toLowerCase();
                        let company_location = "USA";

                        // build car
                        let car = {
                              model: carRecord.model,
                              year: carRecord.year,
                              PriceInINR: carRecord.priceInr,
                              trim: carRecord.trim,
                              engine: carRecord.engine,
                              body: carRecord.body,
                              color: carRecord.color,
                              transmission_type: carRecord.transmission,
                              dealer_id: undefined, // --> just for now
                        };


                        // ? search for the correct dealer --> for mapping
                        let dealer_email = "bitBattle_2018_" + carRecord.DealerID + "_@myKarmaa.com";

                        DealerModel.find({
                              email: dealer_email
                        },(err, dealer) => {
                              if (err) {
                                    console.log("Error : dealer not found for this car");
                                    throw new Error(err);
                              }
                              car.dealer_id = dealer[0]._id; // ? update the dealer_id

                              // ? check if the company exists : and if not then create one --> upsert will do that
                              let query = {
                                    company_name: company_name,
                                    company_location: company_location
                              };

                              let updat_command = {
                                    $push: {
                                          cars: car
                                    }
                              };


                              CompanyModel.updateOne(query, updat_command, {
                                    upsert: true // ? so if it doesn't exist create one
                              }, (err) => {
                                    if (err) {
                                          console.log("Error : while pushing car to the compay's cars");
                                          throw new Error(err);
                                    }
                              });
                        });
                  }
            });

            parseStream.on('end', () => {
                  setTimeout(() => {
                        console.log("==== end parsing json file ====");
                        res.send("done");
                  }, 10000);
            });

            readStream.pipe(parseStream);
      }
});




const carJson = require("./car.json");
API_ROUTER.get('/add_car', (req, res) => {
      let totalEntries = carJson.length;
      // console.log(totalEntries);

      carJson.forEach((car, index) => {
            console.log(car.model);

            if (totalEntries === index) {
                  sendResponse();
            }
      });

      function sendResponse() {
            res.send("added");
      }
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
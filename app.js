// jshint  node :true
"use strict";

const express = require('express'),
      CSV_TO_JSON = require("csvtojson/v2"),
      // PATH = require('path'),
      FS = require('fs'),
      app = express(),
      MONGOOSE = require("mongoose"); // middleware to connect node app & mongoDB | Elegant MongoDB object modeling for Node.js


const BODY_PARSER = require("body-parser");



//! body parser config
app.use(BODY_PARSER.json()); // support parsing of application/json type post data

app.use(BODY_PARSER.urlencoded({ //support parsing of application/x-www-form-urlencoded post data
      extended: true
}));



// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');


app.set("view engine", "ejs"); // middle ware


const google_maps_config = require("./config/google_maps");



// ! connect to mongoDB && Some checks
// Mongoose provides a straight-forward, schema-based solution to model your application data.
//  It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

let DatabaseConfig = require("./config/database");
MONGOOSE.connect(DatabaseConfig.database_host, {
      useNewUrlParser: true
});
const DB = MONGOOSE.connection;


//* check connection                                  database events
DB.once('open', () => {
      console.log('Connected to DB :  SUCCESS');
});

// * check db errors
DB.on('error', (db_err) => {
      console.log("DB ERROR : " + db_err);
});





// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin

const cors = require('cors');

var corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));



//  =======================================   testing  =======================================

app.get(`/`, function (req, res) {
      res.send("HOME");
});



app.get(`/map_view`, (req, res) => { // * for testing

      // let csv_file_path = "./test.csv";
      let csv_file_path = "./stuff/VehicleInventoryData.csv";

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


app.get(`/map_view_object`, (req, res) => { // * for testing

      let json_object_list = require("./saved_dealer.json");
      // console.log(json_object_list);
      // /
      res.render("map_view", {
            config: google_maps_config,
            array_Records_Object: JSON.stringify(json_object_list),
      });
});


//  ===========================================================================================



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




// ! ===================================      ROUTES      ===================================

const API_ROUTER = require("./route/api");
app.use("/api/", API_ROUTER);



const DATA_ROUTER = require("./route/data");
app.use("/data/", DATA_ROUTER);


const BUYER_ROUTER = require("./route/buyer");
app.use("/buyer/", BUYER_ROUTER);


const DEALER_ROUTER = require("./route/dealer");
app.use("/dealer/", DEALER_ROUTER);


// ! ===================================      ROUTES      ===================================


// process.env.PORT   process.env.IP
let port = 3000;
app.listen(port, () => {
      console.log(`server live ${port}`);
});


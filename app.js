// jshint  node :true
"use strict";

const express = require('express'),
      CSV_TO_JSON = require("csvtojson/v2"),
      // PATH = require('path'),
      FS = require('fs'),
      app = express();

// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

app.set("view engine", "ejs"); // middle ware

let config = require("./config.json");


app.get(`/`, function (req, res) {
      // res.send("Hello");
      res.render("home", {
            config: config,
      });
});







app.get(`/map_view`, (req, res) => {

      let csv_file_path = "./test.csv";
      // let csv_file_path = "./VehicleInventoryData.csv";

      let array_Records_Object = [];

      promise_to_parseCSV(csv_file_path, res)
            .then((resolve_List) => {
                        console.log(`DONE : parsing teh CSV file`);

                        array_Records_Object = resolve_List;
                        // console.log(array_Records_Object);

                        res.render("map_view", {
                              config: config,
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




// process.env.PORT   process.env.IP
app.listen(3000, () => {
      console.log("server live");
});


// ! seprately create all the dom elements variable at one place and then use theem thorugh out
// ?

// FS.readFile('./test.csv', (err, file_data_buffer) => {
//       if (err) {
//             throw new Error("can't read file");
//       }
//       console.log(file_data_buffer);
// });
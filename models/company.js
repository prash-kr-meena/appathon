// jshint  node :true
"use strict";

const MONGOOSE = require("mongoose"),
      DB = MONGOOSE.connection;

let companySchema = MONGOOSE.Schema({

      company_name: {
            type: String,
            required: true
      },
      company_location: {
            type: String,
            require: true
      },
      cars: [{
            model: {
                  type: String,
                  required: true
            },
            year: {
                  type: Number,
                  required: true
            },
            PriceInINR: {
                  type: Number,
                  required: true
            },
            trim: {
                  type: String,
                  required: true

            },
            engine: {
                  type: String,
                  required: true
            },
            body: {
                  type: String,
                  required: true
            },
            color: {
                  type: String,
                  required: true
            },
            transmission_type: {
                  type: String,
                  required: true
            },
            dealer_id: {
                  type: String,
                  required: true
            }
      }]


});


let collection_name = "companies";
let CompanyModel = MONGOOSE.model(collection_name, companySchema);
createAscendingIndex_on_company_name(DB);

module.exports = CompanyModel;





//   indexing  at schema level -->  using node js
function createAscendingIndex_on_company_name(DB, callback) {
      let collection = DB.collection(collection_name);

      // ? Create the index
      collection.createIndex({
            company_name: 1, // specifies : indexing type is ascending indexing
      }, {
            unique: true
      }, function (err, result) {
            if (err) {
                  console.log("error while setting up indexing on companies collection");
            }
            console.log("index created  ", result, "<<<<<<<<", collection_name, " collection");
            // callback("result");
      });
}
//? NOTE : Creating indexes in MongoDB is an idempotent operation. So running db.names.createIndex({name:1}) would create the index only if it didn't already exist.
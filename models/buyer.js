// jshint  node :true
"use strict";

// creating modles give us some kind of infrastructure to our data base
// as no-sql databases like mongoDB there is not much structure,
//  its very flexible which can be a greate thing but downfall as well  as our data is not structured at all
// mongoose  fives us ability to structure it on application level, rather then on a data level as we do in mySQL

const MONGOOSE = require("mongoose"),
      DB = MONGOOSE.connection;

// let DatabaseConfig = require("../config/database");

// user schema
let buyerSchema = MONGOOSE.Schema({
      name: {
            type: String,
            required: true,
      },
      email: {
            type: String,
            require: true,
      },
      password: {
            type: String,
            required: true,
      },
      address: {
            proper_address: {
                  type: String,
                  required: true,
            },
            lat: {
                  type: Number,
                  required: true
            },
            long: {
                  type: String,
                  requried: true
            }
      },
      inbox: [{
            date: {
                  type: Date,
                  required: true
            },
            from: {
                  type: String,
                  required: true
            },
            message: {
                  type: String,
                  requried: true
            }
      }],
      outbox: [{
            date: {
                  type: Date,
                  required: true
            },
            to: {
                  type: String,
                  required: true
            },
            message: {
                  type: String,
                  requried: true
            }
      }],
});

let collection_name = "buyers";

let BuyerModel = MONGOOSE.model(collection_name, buyerSchema);
createAscendingIndex_on_user_email(DB);

module.exports = BuyerModel;




//   indexing  at schema level -->  using node js
function createAscendingIndex_on_user_email(DB, callback) {
      let collection = DB.collection(collection_name); // Get the users collection

      // ? Create the index
      collection.createIndex({
            email: 1, // specifies : indexing type is ascending indexing
      }, {
            unique: true
      }, function (err, result) {
            if (err) {
                  console.log("error while setting up indexing");
            }
            console.log("index created  ", result, "<<<<<<<<" , collection_name, " collection");
            // callback("result");
      });
};
//? NOTE : Creating indexes in MongoDB is an idempotent operation. So running db.names.createIndex({name:1}) would create the index only if it didn't already exist.
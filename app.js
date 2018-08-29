// jshint  node :true
"use strict";

const express = require('express'),
      app = express();

app.set("view engine", "ejs"); // middle ware

let config = require("./config.json");


app.get(`/`, function (req, res) {
      // res.send("Hello");
      res.render("app", {
            config: config,
      });
});

// process.env.PORT   process.env.IP
app.listen(3000, () => {
      console.log("server live");
});


// ! seprately create all the dom elements variable at one place and then use theem thorugh out
// ?
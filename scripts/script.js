// jshint node : true
"use strict";

const path = require("path");
const fs = require('fs');
// const path = require('path');
const json = require('big-json');

const readStream = fs.createReadStream(path.join(__dirname, '/test.json'));
const parseStream = json.createParseStream();

let objects = {};
parseStream.on('data', function (pojo) {
      objects = pojo;
      // for (let i in pojo) {
      //       console.log(pojo[i]);
      // }
});

parseStream.on('end', function (pojo) {
      // => receive reconstructed POJO

      console.log("====end====");
});


console.log(objects);

readStream.pipe(parseStream);

// fs.createReadStream(path.join(__dirname, '/car.json'), {
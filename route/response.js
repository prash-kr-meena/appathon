// jshint node : true
"use strict";

let Response = {};

Response.success = function (res, succes_msg) {
      res.json({
            status: 200,
            succes_msg: succes_msg,
            errors: [],
      });
};


Response.error = function (res, error_list) {
      res.json({
            status: 400, // 400 or 500 etc
            msg: undefined,
            errors: error_list,
      });
};


module.exports = Response;
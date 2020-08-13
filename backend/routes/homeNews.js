//
// homeNews.js: A Node.js Module for for home news story management.
//
//

"use strict";
var express = require("express");

var router = express.Router();

//
// Return all the Home Page news stories. Call the middleware first to verify we have a logged in user.
//
router.get("/", function (req, res, next) {
  req.db.collection.findOne(
    { _id: process.env.GLOBAL_STORIES_ID },
    { homeNewsStories: 1 },
    function (err, doc) {
      if (err) return next(err);
      if (!doc) return next(new Error("Home news stories not found."));

      res.status(200).json(doc.homeNewsStories);
    }
  );
});

module.exports = router;

var express = require("express");
var async = require("async");

var router = express.Router();

var Tyre = require("../models/tyre");
var Brand = require("../models/brand");
var Category = require("../models/category");

var tyreRouter = require("./tyre");
var brandRouter = require("./brand");
var categoryRouter = require("./category");

router.get("/", function (req, res) {
  async.parallel(
    {
      tyre_count: function (callback) {
        Tyre.countDocuments({}, callback);
      },
      brand_count: function (callback) {
        Brand.countDocuments({}, callback);
      },
      category_count: function (callback) {
        Category.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "TyreStore Inventory Home",
        error: err,
        data: results,
      });
    }
  );
});

router.get("/tyres", tyreRouter);
router.get("/brands", brandRouter);
router.get("/categories", categoryRouter);

router.use("/tyre", tyreRouter);
router.use("/brand", brandRouter);
router.use("/category", categoryRouter);

module.exports = router;

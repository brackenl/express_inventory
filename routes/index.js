var express = require("express");
var router = express.Router();

var tyreRouter = require("./tyre");
var brandRouter = require("./brand");
var categoryRouter = require("./category");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/tyres", tyreRouter);
router.get("/brands", brandRouter);
router.get("/categories", categoryRouter);

router.use("/tyre", tyreRouter);
router.use("/brand", brandRouter);
router.use("/category", categoryRouter);

module.exports = router;

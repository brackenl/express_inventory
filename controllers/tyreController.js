// var async = require("async");

var Tyre = require("../models/tyre");

// Display list of all Tyres.
exports.tyre_list = function (req, res) {
  Tyre.find({})
    .populate("brand")
    .populate("category")
    .exec(function (err, list_tyres) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      console.log;
      res.render("tyre_list", { title: "Tyre List", tyre_list: list_tyres });
    });
};

// Display detail page for a specific Tyre.
exports.tyre_detail = function (req, res, next) {
  Tyre.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .exec(function (err, tyre) {
      if (err) {
        return next(err);
      }
      if (tyre == null) {
        // No results.
        var err = new Error("Tyre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("tyre_detail", {
        title: tyre.name,
        tyre: tyre,
      });
    });
};

// Display Tyre create form on GET.
exports.tyre_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Tyre create GET");
};

// Handle Tyre create on POST.
exports.tyre_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Tyre create POST");
};

// Display Tyre delete form on GET.
exports.tyre_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Tyre delete GET");
};

// Handle Tyre delete on POST.
exports.tyre_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Tyre delete POST");
};

// Display Tyre update form on GET.
exports.tyre_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Tyre update GET");
};

// Handle Tyre update on POST.
exports.tyre_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Tyre update POST");
};

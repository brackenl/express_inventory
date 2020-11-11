var async = require("async");

var Category = require("../models/category");
var Tyre = require("../models/tyre");

// Display list of all Categories.
exports.category_list = function (req, res) {
  Category.find({}, "name description").exec(function (err, list_categories) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.render("category_list", {
      title: "Category List",
      category_list: list_categories,
    });
  });
};

// Display detail page for a specific Category.
exports.category_detail = function (req, res) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },

      category_tyres: function (callback) {
        Tyre.find({ category: req.params.id }).populate("brand").exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        var err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("category_detail", {
        title: results.category.name,
        category: results.category,
        category_tyres: results.category_tyres,
      });
    }
  );
};

// Display Category create form on GET.
exports.category_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Category create GET");
};

// Handle Category create on POST.
exports.category_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Category create POST");
};

// Display Category delete form on GET.
exports.category_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Category delete GET");
};

// Handle Category delete on POST.
exports.category_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Category delete POST");
};

// Display Category update form on GET.
exports.category_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Category update GET");
};

// Handle Category update on POST.
exports.category_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Category update POST");
};

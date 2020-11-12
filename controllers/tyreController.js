var async = require("async");
const { body, validationResult } = require("express-validator");

var Tyre = require("../models/tyre");
var Brand = require("../models/brand");
var Category = require("../models/category");

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
  // Get all brands and categories, which we can use for adding to our tyre.
  async.parallel(
    {
      brands: function (callback) {
        Brand.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("tyre_form", {
        title: "Create Tyre",
        brands: results.brands,
        categories: results.categories,
      });
    }
  );
};

// Handle Tyre create on POST.
exports.tyre_create_post = [
  // Validate and sanitise fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be specified."),
  body("stock_amount")
    .trim()
    .isInt({ min: 0 })
    .withMessage("Stock amount must be a non-negative number."),
  body("rating")
    .trim()
    .isInt({ min: 0, max: 5 })
    .withMessage("Rating must be a number between 1 and 5."),
  body("brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          brands: function (callback) {
            Brand.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          res.render("tyre_form", {
            title: "Create Tyre",
            brands: results.brands,
            categories: results.categories,
            tyre: tyre,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid.

      // Create a Tyre object with escaped and trimmed data.
      var tyre = new Tyre({
        name: req.body.name,
        description: req.body.description,
        stock_amount: req.body.stock_amount,
        rating: req.body.rating,
        brand: req.body.brand,
        category: req.body.category,
      });
      tyre.save(function (err) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to new tyre record.
        res.redirect(tyre.url);
      });
    }
  },
];

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

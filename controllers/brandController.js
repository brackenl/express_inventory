var async = require("async");
const { body, validationResult } = require("express-validator");

var Brand = require("../models/brand");
var Tyre = require("../models/tyre");

// Display list of all Brands.
exports.brand_list = function (req, res) {
  Brand.find({}, "name description").exec(function (err, list_brands) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.render("brand_list", { title: "Brand List", brand_list: list_brands });
  });
};

// Display detail page for a specific Brand.
exports.brand_detail = function (req, res, next) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },

      brand_tyres: function (callback) {
        Tyre.find({ brand: req.params.id }).populate("category").exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.brand == null) {
        // No results.
        var err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("brand_detail", {
        title: results.brand.name,
        brand: results.brand,
        brand_tyres: results.brand_tyres,
      });
    }
  );
};

// Display Brand create form on GET.
exports.brand_create_get = function (req, res) {
  res.render("brand_form", { title: "Create Brand" });
};

// Handle Brand create on POST. - TO BE UPDATED FOR IMG
exports.brand_create_post = [
  // Validate and santise the name and description fields.
  body("name", "Brand name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a brand object with escaped and trimmed data.
    var brand = new Brand({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Brand with same name already exists.
      Brand.findOne({ name: req.body.name }).exec(function (err, found_brand) {
        if (err) {
          return next(err);
        }

        if (found_brand) {
          // Brand exists, redirect to its detail page.
          res.redirect(found_brand.url);
        } else {
          brand.save(function (err) {
            if (err) {
              return next(err);
            }
            // Brand saved. Redirect to brand detail page.
            res.redirect(brand.url);
          });
        }
      });
    }
  },
];

// Display Brand delete form on GET.
exports.brand_delete_get = function (req, res) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_tyres: function (callback) {
        Tyre.find({ brand: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.brand == null) {
        // No results.
        res.redirect("/brands");
      }
      // Successful, so render.
      res.render("brand_delete", {
        title: "Delete Brand",
        brand: results.brand,
        brand_tyres: results.brand_tyres,
      });
    }
  );
};

// Handle Brand delete on POST.
exports.brand_delete_post = function (req, res) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_tyres: function (callback) {
        Tyre.find({ brand: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.brand_tyres.length > 0) {
        // Brand has tyres. Render in same way as for GET route.
        res.render("brand_delete", {
          title: "Delete Brand",
          brand: results.brand,
          brand_tyres: results.brand_tyres,
        });
        return;
      } else {
        // Author has no books. Delete object and redirect to the list of brands.
        Brand.findByIdAndRemove(req.body.brandid, function deleteBrand(err) {
          if (err) {
            return next(err);
          }
          // Success - go to brand list
          res.redirect("/brands");
        });
      }
    }
  );
};

// Display Brand update form on GET.
exports.brand_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Brand update GET");
};

// Handle Brand update on POST.
exports.brand_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Brand update POST");
};

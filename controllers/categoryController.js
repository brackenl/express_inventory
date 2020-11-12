var async = require("async");
const { body, validationResult } = require("express-validator");

var Category = require("../models/category");
var Tyre = require("../models/tyre");

// Display list of all Categories.
exports.category_list = function (req, res) {
  Category.find({}).exec(function (err, list_categories) {
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
  res.render("category_form", { title: "Create Category" });
};

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and santise the name and description fields.
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("img-file")
    .custom((value, { req }) => {
      if (!req.file) {
        return "No image";
      } else if (
        req.file.mimetype === "image/bmp" ||
        req.file.mimetype === "image/gif" ||
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/png" ||
        req.file.mimetype === "image/tiff" ||
        req.file.mimetype === "image/webp"
      ) {
        return "image"; // return "non-falsy" value to indicate valid data"
      } else {
        return false; // return "falsy" value to indicate invalid data
      }
    })
    .withMessage("You may only submit image files."),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    var category = new Category({
      name: req.body.name,
      description: req.body.description,
      imgUrl: req.file ? "/images/" + req.file.filename : null,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      Category.findOne({ name: req.body.name }).exec(function (
        err,
        found_category
      ) {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // Category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          category.save(function (err) {
            if (err) {
              return next(err);
            }
            // Category saved. Redirect to category detail page.
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

// Display Category delete form on GET.
exports.category_delete_get = function (req, res) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_tyres: function (callback) {
        Tyre.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        res.redirect("/categories");
      }
      // Successful, so render.
      res.render("category_delete", {
        title: "Delete Category",
        category: results.category,
        category_tyres: results.category_tyres,
      });
    }
  );
};

// Handle Category delete on POST.
exports.category_delete_post = [
  // Validate and sanitise fields.
  body("password")
    .trim()
    .escape()
    .equals("password123")
    .withMessage("Admin password incorrect."),

  function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      async.parallel(
        {
          category: function (callback) {
            Category.findById(req.params.id).exec(callback);
          },
          category_tyres: function (callback) {
            Tyre.find({ category: req.params.id }).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          if (results.category == null) {
            // No results.
            res.redirect("/categories");
          }
          res.render("category_delete", {
            title: "Delete Category",
            category: results.category,
            category_tyres: results.category_tyres,
            errors: errors.array(),
          });

          return;
        }
      );
    } else {
      async.parallel(
        {
          category: function (callback) {
            Category.findById(req.params.id).exec(callback);
          },
          category_tyres: function (callback) {
            Tyre.find({ category: req.params.id }).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          // Success
          if (results.category_tyres.length > 0) {
            // Category has tyres. Render in same way as for GET route.
            res.render("category_delete", {
              title: "Delete Category",
              category: results.category,
              category_tyres: results.category_tyres,
            });
            return;
          } else {
            // Author has no books. Delete object and redirect to the list of categories.
            Category.findByIdAndRemove(
              req.body.categoryid,
              function deleteCategory(err) {
                if (err) {
                  return next(err);
                }
                // Success - go to category list
                res.redirect("/categories");
              }
            );
          }
        }
      );
    }
  },
];

// Display Category update form on GET.
exports.category_update_get = function (req, res) {
  // Get brand details for form.
  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return next(err);
    }
    if (category == null) {
      // No results.
      var err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render("category_form", {
      title: "Update Category",
      category: category,
    });
  });
};

// Handle Category update on POST.
exports.category_update_post = [
  // Validate and sanitise fields.
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("img-file")
    .custom((value, { req }) => {
      if (!req.file) {
        return "No image";
      } else if (
        req.file.mimetype === "image/bmp" ||
        req.file.mimetype === "image/gif" ||
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/png" ||
        req.file.mimetype === "image/tiff" ||
        req.file.mimetype === "image/webp"
      ) {
        return "image"; // return "non-falsy" value to indicate valid data"
      } else {
        return false; // return "falsy" value to indicate invalid data
      }
    })
    .withMessage("You may only submit image files."),
  body("password")
    .trim()
    .escape()
    .equals("password123")
    .withMessage("Admin password incorrect."),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped/trimmed data and old id.
    var category = new Category({
      name: req.body.name,
      description: req.body.description,
      imgUrl: req.file ? "/images/" + req.file.filename : null,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Category.findByIdAndUpdate(req.params.id, category, {}, function (
        err,
        updatedCategory
      ) {
        if (err) {
          return next(err);
        }
        // Successful - redirect to Category detail page.
        res.redirect(updatedCategory.url);
      });
    }
  },
];

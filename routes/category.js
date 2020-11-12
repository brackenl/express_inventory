var express = require("express");
var router = express.Router();

var upload = require("../utils/multUpload");

// Require controller modules.
var categoryController = require("../controllers/categoryController");

// GET request for list of all Category items.
router.get("/categories", categoryController.category_list);

// GET request for creating a Category.
router.get("/create", categoryController.category_create_get);

// POST request for creating Category.
router.post(
  "/create",
  upload.single("img-file"),
  categoryController.category_create_post
);

// GET request to delete Category.
router.get("/:id/delete", categoryController.category_delete_get);

// POST request to delete Category.
router.post("/:id/delete", categoryController.category_delete_post);

// GET request to update Category.
router.get("/:id/update", categoryController.category_update_get);

// POST request to update Category.
router.post(
  "/:id/update",
  upload.single("img-file"),
  categoryController.category_update_post
);

// GET request for one Category.
router.get("/:id", categoryController.category_detail);

module.exports = router;

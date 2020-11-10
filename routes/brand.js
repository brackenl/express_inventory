var express = require("express");
var router = express.Router();

// Require controller modules.
var brandController = require("../controllers/brandController");

// GET request for list of all Brand items.
router.get("/brands", brandController.brand_list);

// GET request for creating a Brand.
router.get("/create", brandController.brand_create_get);

// POST request for creating Brand.
router.post("/create", brandController.brand_create_post);

// GET request to delete Brand.
router.get("/:id/delete", brandController.brand_delete_get);

// POST request to delete Brand.
router.post("/:id/delete", brandController.brand_delete_post);

// GET request to update Brand.
router.get("/:id/update", brandController.brand_update_get);

// POST request to update Brand.
router.post("/:id/update", brandController.brand_update_post);

// GET request for one Brand.
router.get("/:id", brandController.brand_detail);

module.exports = router;

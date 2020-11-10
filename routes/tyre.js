var express = require("express");
var router = express.Router();

// Require controller modules.
var tyreController = require("../controllers/tyreController");

// GET request for list of all Tyre items.
router.get("/tyres", tyreController.tyre_list);

// GET request for creating a Tyre.
router.get("/create", tyreController.tyre_create_get);

// POST request for creating Tyre.
router.post("/create", tyreController.tyre_create_post);

// GET request to delete Tyre.
router.get("/:id/delete", tyreController.tyre_delete_get);

// POST request to delete Tyre.
router.post("/:id/delete", tyreController.tyre_delete_post);

// GET request to update Tyre.
router.get("/:id/update", tyreController.tyre_update_get);

// POST request to update Tyre.
router.post("/:id/update", tyreController.tyre_update_post);

// GET request for one Tyre.
router.get("/:id", tyreController.tyre_detail);

module.exports = router;

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BrandSchema = new Schema({
  name: { type: String, minlength: 3, maxlength: 20, required: true },
  description: { type: String, maxlength: 100, required: true },
});

BrandSchema.virtual("url").get(function () {
  return "/brand/" + this._id;
});

module.exports = mongoose.model("Brand", BrandSchema);

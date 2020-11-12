var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TyreSchema = new Schema({
  name: { type: String, required: true, maxlength: 20 },
  description: { type: String, required: true, maxlength: 100 },
  stock_amount: { type: Number, required: true },
  rating: { type: Number, required: true },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  imgUrl: { type: String, required: false },
});

// Virtual for tyre's URL
TyreSchema.virtual("url").get(function () {
  return "/tyre/" + this._id;
});

//Export model
module.exports = mongoose.model("Tyre", TyreSchema);

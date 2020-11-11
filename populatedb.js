#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");

var Tyre = require("./models/tyre");
var Brand = require("./models/brand");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var tyres = [];
var brands = [];
var categories = [];

function brandCreate(name, description, imgUrl, cb) {
  var brand = new Brand({
    name: name,
    description: description,
    imgUrl: imgUrl,
  });

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Brand: " + brand);
    brands.push(brand);
    cb(null, brand);
  });
}

function categoryCreate(name, description, imgUrl, cb) {
  var category = new Category({
    name: name,
    description: description,
    imgUrl: imgUrl,
  });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function tyreCreate(
  name,
  description,
  stock_amount,
  rating,
  category,
  brand,
  cb
) {
  var tyreComponents = {
    name: name,
    description: description,
    stock_amount: stock_amount,
    rating: rating,
    category: category,
    brand: brand,
  };
  console.log("tyre object: ", tyreComponents);
  var tyre = new Tyre(tyreComponents);

  tyre.save(function (err) {
    if (err) {
      console.log(err);
      cb(err, null);
      return;
    }
    console.log("New Tyre: " + tyre);
    tyres.push(tyre);
    cb(null, tyre);
  });
}

function createBrandAndCategories(cb) {
  async.series(
    [
      function (callback) {
        brandCreate("Purelli", "An Italian premium brand", callback);
      },
      function (callback) {
        brandCreate("Muchelin", "A French premium brand", callback);
      },
      function (callback) {
        brandCreate("Tokohama", "A Japanese mid-range brand", callback);
      },
      function (callback) {
        categoryCreate(
          "Summer",
          "Standard tyres providing optimised performance above 5°c",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "Winter",
          "Grooved tyres providing superior grip on icy and wet surfaces",
          callback
        );
      },
      function (callback) {
        categoryCreate(
          "All-season",
          "Tyres designed to perform well in all conditions",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createTyres(cb) {
  async.parallel(
    [
      function (callback) {
        tyreCreate(
          "Sports F1",
          "Designed to go fast",
          100,
          5,
          categories[0],
          brands[0],
          callback
        );
      },
      function (callback) {
        tyreCreate(
          "Le Mans 25",
          "Designed for racing all day",
          99,
          4,
          categories[0],
          brands[1],
          callback
        );
      },
      function (callback) {
        tyreCreate(
          "Mountaineer 1000",
          "So that you can drive up a mountain in the snow",
          5,
          4,
          categories[1],
          brands[2],
          callback
        );
      },
      function (callback) {
        tyreCreate(
          "Tokyo 365",
          "Fairly standard all-season tyres",
          20,
          3,
          categories[2],
          brands[2],
          callback
        );
      },
      function (callback) {
        tyreCreate(
          "SnowDrive",
          "For when it's really cold outside",
          10,
          4,
          categories[1],
          brands[0],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createBrandAndCategories, createTyres],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Tyres: " + tyres);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);

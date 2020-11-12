var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    console.log(file);
    const regEx = /\.[0-9a-z]+$/i;
    const fileExt = file.originalname.match(regEx);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExt);
  },
});

module.exports = multer({ dest: "uploads/", storage: storage });

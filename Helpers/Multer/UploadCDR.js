const multer = require("multer");

var storage = (suffix) =>
    multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads/" + suffix);
        },
        filename: function (req, file, cb) {
            let temp = file.originalname.split(" ");
            temp = temp.join("_");
            cb(null, Date.now() + "_" + temp);
        },
    });
const fileFilter = (req, file, cb) => {
    const arr = file.originalname.split(".");
    const ext = arr[arr.length - 1];
    if (ext.toLowerCase().trim() === "cdr") cb(null, true);
    else cb(null, false);
};
const upload = (suffix, ext) =>
    multer({
        storage: storage(suffix),
        limits: {
            fileSize: 1024 * 1024 * 50,
        },
        fileFilter: fileFilter,
    });

module.exports = upload;

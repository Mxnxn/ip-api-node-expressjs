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
function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = (suffix) =>
    multer({
        storage: storage(suffix),
        limits: {
            fileSize: 1024 * 1024 * 50,
        },
        fileFilter: fileFilter,
    });

module.exports = upload;

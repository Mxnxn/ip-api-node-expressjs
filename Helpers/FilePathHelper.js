const path = require("path");
const { rootPath } = require("../Path");

module.exports.FilePathHelper = (filepath) => {
    return path.resolve(rootPath + "/" + filepath);
};

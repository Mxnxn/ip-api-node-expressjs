const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "carebydharmprints@gmail.com",
        pass: "Dh@2mpr!n1s",
    },
});

mailTransporter.use(
    "compile",
    hbs({
        viewEngine: { extName: ".handlebars", defaultLayout: false },
        viewPath: path.resolve("./views/email"),
    })
);

module.exports = mailTransporter;

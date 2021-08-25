const app = require("express").Router();
const Admin = require("../Model/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const upload = multer();
const { AdminAuthSchema } = require("../Helpers/JoiVerifier");
app.use("/*", (req, res, next) => next());

app.post("/login", upload.none(), async (req, res) => {
    const { error, value } = await AdminAuthSchema.validate(req.body);
    if (error) {
        const msgs = error.details.map((el) => el.message);
        return res.json({
            code: 422,
            status: false,
            message: msgs,
        });
    }
    const data = await Admin.findOne({ email: req.body.email });
    if (!data) {
        return res.json({
            code: 422,
            status: false,
            message: "Email doesn't exist.",
        });
    } else {
        const result = await bcrypt.compare(req.body.password, data.password);
        if (result) {
            const uuidx = uuidv4();
            const token = jwt.sign({ random: uuidx }, process.env.JWT_KEY);
            data.token = token;
            data.save();
            return res.json({
                code: 200,
                data: {
                    token: token,
                    email: data.email,
                    uid: data._id,
                },
                status: true,
            });
        } else {
            return res.json({
                code: 422,
                message: "Invalid credential.",
                status: false,
            });
        }
    }
});

// app.post("/register", upload.none(), async (req, res) => {
//     if (!req.body.email || !req.body.password || !req.body.name) {
//         return res.json({
//             code: 422,
//             status: false,
//             message: "Invalid request.",
//         });
//     }
//     const data = await Admin.findOne({ email: req.body.email });
//     if (data) {
//         return res.json({
//             code: 401,
//             message: "Email already Exists.",
//             status: false,
//         });
//     } else {
//         try {
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(req.body.password, salt);

//             const mUser = new Admin({
//                 email: req.body.email,
//                 password: hashedPassword,
//                 name: req.body.name,
//             });

//             const savedData = await mUser.save();
//             if (savedData) {
//                 return res.json({
//                     code: 200,
//                     message: "Registration successful",
//                     status: true,
//                 });
//             }
//         } catch (err) {
//             res.json({ code: 500, message: "Internal error", status: false });
//             return res.end();
//         }
//     }
// });

module.exports = app;

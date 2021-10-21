const { Response } = require("../../Helpers/Response");
const { ResponseBodyError } = require("../../Helpers/BodyError");
const mailTransporter = require("../../Helpers/MailTransporter");
const { getDate } = require("../../Helpers/DateHelper");
const path = require("path");
const User = require("../../Model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmailToUser = async (req, res) => {
    if (!req.body.email) return Response(res, 402, ["Bad Request!"]);
    const mUser = await User.findOne({ email: req.body.email });
    if (!mUser) return Response(res, 200, ["Password reset link has been sent to your email."]);

    const token = jwt.sign({ uid: mUser._id, email: mUser.email }, process.env.JWT_KEY, { expiresIn: 60 * 5 });

    let mailDetails = {
        from: "caerbydharmprints@gmail.com",
        to: req.body.email,
        subject: "Reset Password Link",
        attachments: [
            {
                filename: "xx.png",
                path: path.resolve("./uploads/xx.png"),
                cid: "logo",
            },
            {
                filename: "bullet.jpg",
                path: path.resolve("./uploads/bullet.jpg"),
                cid: "bullet",
            },
        ],
        context: {
            url: `http://localhost:5000/user/forgetPassword/${token}`,
            date: getDate(new Date()),
        },
        template: "fix",
    };
    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err);
            return res.json({ message: "Error" });
        } else {
            return res.json({ message: "Email sent successfully" });
        }
    });
};

const resetPassword = async (req, res) => {
    const token = req.header("SESSION-TOKEN");
    if (!token) return Response(res, 402, ["Bad Request!"]);
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const newP = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newP, salt);
        await User.findByIdAndUpdate(decoded.uid, { password: hashedPassword });
        return Response(res, 200, ["Successfully reset."]);
    } catch (error) {
        console.log(error);
        return res.render("unknown");
    }
};

const CheckingToken = async (req, res) => {
    try {
        jwt.verify(req.params.token, process.env.JWT_KEY);
        res.render("passwords");
    } catch (error) {
        res.render("unknown");
    }
};

module.exports = {
    sendEmailToUser,
    resetPassword,
    CheckingToken,
};

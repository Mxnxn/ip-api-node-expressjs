const Admin = require("../../Model/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AdminAuthSchema } = require("../../Helpers/JoiVerifier");
const { ResponseBodyError } = require("../../Helpers/BodyError");
const { Response } = require("../../Helpers/Response");

const Login = async (req, res) => {
    const { error, value } = await AdminAuthSchema.validate(req.body);
    if (error) ResponseBodyError(res, error);
    const data = await Admin.findOne({ email: value.email });
    if (!data) {
        return res.json({
            code: 422,
            status: false,
            message: "Email doesn't exist.",
        });
    } else {
        const result = await bcrypt.compare(value.password, data.password);
        if (result) {
            const token = jwt.sign({ _id: data._id }, process.env.JWT_KEY);
            data.token = token;
            data.save();
            return Response(res, 200, {
                token: token,
                email: data.email,
                uid: data._id,
            });
        } else {
            return Response(res, 422, ["Invalid credential."]);
        }
    }
};

const Register = async (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.name) {
        return res.json({
            code: 422,
            status: false,
            message: "Invalid request.",
        });
    }
    const data = await Admin.findOne({ email: req.body.email });
    if (data) {
        return res.json({
            code: 401,
            message: "Email already Exists.",
            status: false,
        });
    } else {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const mUser = new Admin({
                email: req.body.email,
                password: hashedPassword,
                name: req.body.name,
            });

            const savedData = await mUser.save();
            if (savedData) {
                return res.json({
                    code: 200,
                    message: "Registration successful",
                    status: true,
                });
            }
        } catch (err) {
            res.json({ code: 500, message: "Internal error", status: false });
            return res.end();
        }
    }
};

module.exports = { Login, Register };

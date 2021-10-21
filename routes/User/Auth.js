const User = require("../../Model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Wallet = require("../../Model/Wallet");
const { UserLoginSchema } = require("../../Helpers/JoiVerifier");
const { ResponseBodyError } = require("../../Helpers/BodyError");
const { Response } = require("../../Helpers/Response");
const { UserRegistrationSchema } = require("../../Helpers/JoiVerifier");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

const Login = async (req, res) => {
    try {
        const { error, value } = await UserLoginSchema.validate(req.body);
        if (error) return ResponseBodyError(res, error.message);
        const data = await User.findOne({ email: value.email });
        if (!data) {
            return Response(res, 422, ["Email doesn't exist."]);
        } else {
            const result = await bcrypt.compare(value.password, data.password);
            if (result) {
                if (!data.granted_access) {
                    return Response(res, 402, [
                        "Your process is under review. We will contact soon via email. if you have any query mail us on carebydharmprints@gmail.com",
                    ]);
                }
                const token = jwt.sign({ random: data.name }, process.env.JWT_KEY, { expiresIn: "1d" });
                data.token = token;
                data.save();
                return Response(res, 200, {
                    token: token,
                    email: data.email,
                    uid: data._id,
                    message: "Successfully Logged In",
                });
            } else {
                return Response(res, 422, ["Invalid credential."]);
            }
        }
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};

const Register = async (req, res) => {
    try {
        const { value, error } = await UserRegistrationSchema.validate(req.body);
        if (error) return ResponseBodyError(res, error);

        if (!req.file) return ResponseBodyError(res, { details: [{ message: "Business Proof is missing!" }] });

        let existingUser = await User.findOne({ email: value.email });
        if (existingUser) {
            await unlinkAsync(`${req.file.path}`);
            return ResponseBodyError(res, { details: [{ message: "User Already Exist with this email." }] });
        }
        existingUser = await User.findOne({ phone: value.phone });
        if (existingUser) {
            await unlinkAsync(`${req.file.path}`);
            return ResponseBodyError(res, { details: [{ message: "User Already Exist with this phone." }] });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(value.password, salt);

        const mUser = await new User({
            name: value.name,
            phone: value.phone,
            whatsapp: value.whatsapp,
            email: value.email,
            password: hashedPassword,
            companyName: value.companyName,
            street: value.street,
            gst: value.gst,
            businessproof: req.file.path,
            city: value.city,
            state: value.state,
            pincode: value.pincode,
            landmark: value.landmark,
            token: value.token,
        });
        const mWallet = await new Wallet({
            currentBalance: 0,
            uid: mUser._id,
        }).save();
        mUser.wallet = mWallet._id;
        mUser.save();
        const temp = { ...mUser._doc };
        delete temp["password"];
        return Response(res, 200, temp);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};

module.exports = { Login, Register };

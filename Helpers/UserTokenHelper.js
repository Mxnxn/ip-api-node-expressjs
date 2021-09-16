const User = require("../Model/User");
const jwt = require("jsonwebtoken");

async function tokenHelper(req, res, next) {
    const SESSION_TOKEN = req.header("SESSION-TOKEN");
    if (!SESSION_TOKEN) {
        return res.json({
            code: 401,
            message: "Unauthorized.",
            status: false,
        });
    }
    try {
        jwt.verify(SESSION_TOKEN, process.env.JWT_KEY);
        const data = await User.findOne({ token: SESSION_TOKEN });
        if (data) {
            if (data.granted_access) return next();
        }
        console.log(data);
        return res.json({
            code: 401,
            message: "Unauthorized.",
            status: false,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            code: 401,
            message: "Unauthorized.",
            status: false,
        });
    }
}
module.exports.UserTokenHelper = tokenHelper;

const User = require("../Model/User");

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
        const data = await User.findOne({ token: SESSION_TOKEN });
        if (data) {
            if (data.granted_access) return next();
        }
        return res.json({
            code: 401,
            message: "Unauthorized.",
            status: false,
        });
    } catch (error) {
        return res.json({
            code: 401,
            message: "Unauthorized.",
            status: false,
        });
    }
}
module.exports.UserTokenHelper = tokenHelper;

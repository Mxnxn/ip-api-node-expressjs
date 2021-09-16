const Admin = require("../Model/Admin");
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
        const data = await Admin.findOne({ token: SESSION_TOKEN });
        if (data) {
            if (data && data.token === SESSION_TOKEN) {
                return next();
            } else {
                return res.json({
                    code: 401,
                    message: "Unauthorized.",
                    status: false,
                });
            }
        } else {
            return res.json({
                code: 401,
                message: "Unauthorized.",
                status: false,
            });
        }
    } catch (error) {
        return res.json({
            code: 401,
            message: "Unauthorized.",
            status: false,
        });
    }
}
module.exports.TokenHelper = tokenHelper;

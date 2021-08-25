const Admin = require("../Model/Admin");

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
        const data = await Admin({ token: SESSION_TOKEN });
        if (data) {
            if (data.is_active) {
                return next();
            } else {
                return res.json({
                    code: 401,
                    message: "Unauthorized.",
                    status: false,
                });
            }
        }
    } catch (error) {
        console.log(error);
        return res.json({
            code: 401,
            message: "Unauthorized.",
            status: false,
        });
    }
}
module.exports.TokenHelper = tokenHelper;

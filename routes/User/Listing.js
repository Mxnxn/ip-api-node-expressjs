const { Response } = require("../../Helpers/Response");
const User = require("../../Model/User");

const GetUserForUser = async (req, res) => {
    try {
        if (!req.params.uid) {
            return Response(res, 400, ["Invalid Request!"]);
        }
        const user = await User.findById(req.params.uid)
            .select(["name", "phone", "companyName", "street", "city", "state", "pincode", "email", "businessproof", "wallet"])
            .populate({ path: "wallet", populate: "balanceHistory" });
        return Response(res, 200, user);
    } catch (error) {
        return Response(res, 500, ["Internal Error!"]);
    }
};

module.exports = { GetUserForUser };

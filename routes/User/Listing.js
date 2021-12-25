const { Response } = require("../../Helpers/Response");
const User = require("../../Model/User");
const { UserUpdationSchema } = require("../../Helpers/JoiVerifier");

const GetUserForUser = async (req, res) => {
    try {
        if (!req.params.uid) {
            return Response(res, 400, ["Invalid Request!"]);
        }
        const user = await User.findById(req.params.uid)
            .select(["name", "phone", "companyName", "street", "city", "state", "pincode", "email", "businessproof", "wallet"])
            .populate({ path: "wallet", populate: { path:"balanceHistory", options:{sort:"-createdAt"}} });
        return Response(res, 200, user);
    } catch (error) {
        return Response(res, 500, ["Internal Error!"]);
    }
};

const UpdateUserDetail = async (req,res) => {
    try {
        const {error,value } = await UserUpdationSchema.validate(req.body);
        if(error) return Response(res,422,error.message);
        console.log(value)
        const mUser = await User.findOneAndUpdate(value._id,{...value}).select(["name", "phone", "companyName", "street", "city", "state", "pincode", "email", "businessproof", "wallet"])
            .populate({ path: "wallet", populate: "balanceHistory" });
        return Response(res, 200, mUser);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
        
    }
}
module.exports = { GetUserForUser,UpdateUserDetail };

const { Response } = require("../../Helpers/Response");
const { ResponseBodyError } = require("../../Helpers/BodyError");
const Wallet = require("../../Model/Wallet");
const { GrantMoneySchema, RejectMoneyAdditionSchema } = require("../../Helpers/JoiVerifier");
const BalanceHistory = require("../../Model/BalanceHistory");
const User = require("../../Model/User");

const selectionKeys = ["name", "phone", "email", "granted_access", "companyName", "street", "businessproof", "city", "state", "pincode", "_id"];
const walletselectionKeys = ["name", "granted_access", "_id"];

const GetUsers = async (req, res) => {
    try {
        const users = await User.find({}).select(selectionKeys);
        return Response(res, 200, users);
    } catch (error) {
        return Response(res, 500, ["Internal Error!"]);
    }
};

const GetUser = async (req, res) => {
    try {
        if (!req.params.uid) {
            return Response(res, 400, ["Invalid Request!"]);
        }
        const user = await User.findById(req.params.uid).select(walletselectionKeys).populate({ path: "wallet", populate: "balanceHistory" });
        return Response(res, 200, user);
    } catch (error) {
        return Response(res, 500, ["Internal Error!"]);
    }
};

const RestrictUser = async (req, res) => {
    try {
        if (!req.params.uid) {
            return Response(res, 400, ["Invalid Request."]);
        }
        const user = await User.findByIdAndUpdate(req.params.uid, { granted_access: false });
        return Response(res, 200, ["Successfully Blocked"]);
    } catch (error) {
        return Response(res, 500, ["Internal Error."]);
    }
};

const ActivateUser = async (req, res) => {
    try {
        if (!req.params.uid) {
            return Response(res, 400, ["Invalid Request."]);
        }
        const user = await User.findByIdAndUpdate(req.params.uid, { granted_access: true });
        return Response(res, 200, ["Successfully Activated."]);
    } catch (error) {
        return Response(res, 500, ["Internal Error."]);
    }
};

module.exports = {
    GetUsers,
    GetUser,
    RestrictUser,
    ActivateUser,
};

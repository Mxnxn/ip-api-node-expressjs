const { Response } = require("../../Helpers/Response");
const { ResponseBodyError } = require("../../Helpers/BodyError");
const Wallet = require("../../Model/Wallet");
const { GrantMoneySchema, RejectMoneyAdditionSchema } = require("../../Helpers/JoiVerifier");
const BalanceHistory = require("../../Model/BalanceHistory");

const addMoneyToWallet = async (req, res) => {
    try {
        const { error, value } = await GrantMoneySchema.validate(req.body);
        if (error) return ResponseBodyError(res, error);
        // FINDING WALLET
        let mWallet = await Wallet.findOne({ uid: value.uid }).populate("balanceHistory");
        // if it doesnt exists
        if (!mWallet) return Response(res, 401, ["User Doesn't Exists!"]);
        // finding that record of money
        let history = await BalanceHistory.findById(value.bhid);
        // if it already added
        if (history.granted) return Response(res, 200, "Already added to wallet!");
        history.granted = true;
        history.save();
        // updating current wallet balance
        mWallet.currentBalance = parseInt(mWallet.currentBalance) + parseInt(history.balance);
        mWallet.save();
        return Response(res, 200, ["Successfully Granted"]);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};

const rejectMoneyAddtion = async (req, res) => {
    try {
        const { error, value } = await RejectMoneyAdditionSchema.validate(req.body);
        if (error) return ResponseBodyError(res, error);
        let mWallet = await Wallet.findOne({ uid: value.uid }).populate("balanceHistory");
        if (!mWallet) return Response(res, 401, ["User Doesn't Exists!"]);
        let history = await BalanceHistory.findById(value.bhid);
        if (history.granted) return Response(res, 200, "Already added to wallet!");
        history.reject = true;
        history.reason = value.reason;
        history.save();
        return Response(res, 200, ["Following Request Rejected"]);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};

const getRequests = async (req, res) => {
    try {
        if (!req.params.page) Response(res, 400, ["Page number is missing!"]);
        const requests = (parseInt(req.params.page) - 1) * 30;
        const balanceRequests = await BalanceHistory.find({}, {}, { skip: requests, limit: 30 })
            .populate({
                path: "uid",
                select: ["name", "email", "phone", "_id"],
            })
            .sort("-createdAt");
        balanceRequests.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        const balanceCount = await BalanceHistory.countDocuments();
        const responseObj = {
            count: balanceCount,
            requests: balanceRequests,
        };
        return Response(res, 200, responseObj);
    } catch (error) {
        return Response(res, 500, ["Internal Error!"]);
    }
};

module.exports = {
    addMoneyToWallet,
    rejectMoneyAddtion,
    getRequests,
};

const { Response } = require("../../Helpers/Response");
const { ResponseBodyError } = require("../../Helpers/BodyError");
const Wallet = require("../../Model/Wallet");
const { AddWalletMoneySchema } = require("../../Helpers/JoiVerifier");
const BalanceHistory = require("../../Model/BalanceHistory");

const getWalletWithHistory = async (req, res) => {
    try {
        const mWallet = await Wallet.findOne({ uid: req.params.uid }).populate("balanceHistory");
        return Response(res, 200, mWallet);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};
const addMoneyToWallet = async (req, res) => {
    try {
        const { error, value } = await AddWalletMoneySchema.validate(req.body);
        if (error) return ResponseBodyError(res, error);
        let mWallet = await Wallet.findOne({ uid: value.uid });
        const mTransaction = await new BalanceHistory({
            balance: value.amount,
            wallet: mWallet._id,
            uid: value.uid,
        });
        mTransaction.save();
        const updatedWallet = await Wallet.findByIdAndUpdate(
            mWallet._id,
            { currentBalance: parseInt(mWallet.currentBalance) + parseInt(value.amount), $push: { balanceHistory: mTransaction._id } },
            { returnOriginal: false }
        ).populate("balanceHistory");
        return Response(res, 200, updatedWallet);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};

module.exports = {
    getWalletWithHistory,
    addMoneyToWallet,
};

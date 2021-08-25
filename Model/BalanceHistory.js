const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BalanceHistory = new Schema(
    {
        uid: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        balance: {
            type: Number,
            required: true,
        },
        wallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BalanceHistory", BalanceHistory);

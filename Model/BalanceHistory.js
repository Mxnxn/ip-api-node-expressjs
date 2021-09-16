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
        file: {
            required: true,
            type: String,
        },
        reason: {
            type: String,
        },
        reject: {
            type: Boolean,
            default: false,
        },
        granted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BalanceHistory", BalanceHistory);

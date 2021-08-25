const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Wallet = new Schema(
    {
        uid: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        currentBalance: {
            type: Number,
            required: true,
        },
        balanceHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "BalanceHistory",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Wallet", Wallet);

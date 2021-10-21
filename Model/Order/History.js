const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderHistory = new Schema(
    {
        uid: { required: true, type: Schema.Types.ObjectId, ref: "User" },
        product: [{ required: true, type: Schema.Types.ObjectId, ref: "OrderedProduct" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderHistory", OrderHistory);

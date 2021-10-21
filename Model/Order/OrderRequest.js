const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderHistory = new Schema(
    {
        uid: { required: true, type: Schema.Types.ObjectId, ref: "User" },
        product: [{ required: true, type: Schema.Types.ObjectId, ref: "OrderedProduct" }],
        inprocess: {
            type: String,
        },
        dispatched: {
            type: String,
        },
        received: {
            type: Boolean,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderHistory", OrderHistory);

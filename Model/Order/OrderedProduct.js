const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderedProduct = new Schema(
    {
        product: { required: true, type: Schema.Types.ObjectId, ref: "Product" },
        length: {
            type: Number,
        },
        height: {
            type: Number,
        },
        qty: {
            type: Number,
            required: true,
        },
        designFile: {
            type: String,
            required: true,
        },
        estimatedValue: {
            type: Number,
            required: true,
        },
        uid: { required: true, type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderedProduct", OrderedProduct);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cart = new Schema(
    {
        uid: { required: true, type: Schema.Types.ObjectId, ref: "User" },
        product: [{ type: Schema.Types.ObjectId, ref: "CartProduct" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", Cart);

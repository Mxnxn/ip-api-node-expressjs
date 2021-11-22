const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartProduct = new Schema(
    {
        name: { type: String, required: true },
        price: { type: String, required: true },
        description: { type: String, required: true },
        gsmOrMicron: { type: String },
        isAvailable: { type: Boolean, default: false },
        sizeWithQty: {
            type: Boolean,
            default: false,
        },
        numericPrice: { type: Number, required: true },
        category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
        images: [{ type: Schema.Types.ObjectId, ref: "ImageBucket", required: true }],
        reviews: { type: Schema.Types.ObjectId, ref: "Reviews" },
        sizes: [{ type: Number }],
        eyelets: { type: Boolean, default: false },
        len: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        designFile: {
            type: String,
            required: true,
        },
        uid: { required: true, type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CartProduct", CartProduct);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    gsmOrMicron: { type: String },
    isAvailable: { type: Boolean, default: false },
    sizeWithQty: {
        type: Boolean,
        default: false,
    },
    category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
    images: [{ type: Schema.Types.ObjectId, ref: "ImageBucket", required: true }],
    reviews: { type: Schema.Types.ObjectId, ref: "Reviews" },
});

module.exports = mongoose.model("Product", Product);

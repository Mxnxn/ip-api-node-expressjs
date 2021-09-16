const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageBucket = new Schema(
    {
        url: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Product",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ImageBucket", ImageBucket);

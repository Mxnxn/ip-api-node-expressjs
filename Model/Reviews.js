const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Reviews = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        stars: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Reviews", Reviews);

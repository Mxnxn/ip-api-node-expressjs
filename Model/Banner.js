const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Banner = new Schema(
    {
        url: {
            type: String,
            required: true,
        },
        alt: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Banner", Banner);

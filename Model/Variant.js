const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Variant = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        details: {
            type: String,
            required: true,
        },
        numericPrice: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        pid: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Variant", Variant);

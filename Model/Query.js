const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Query = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "AllProduct",
        },
        query: {
            type: String,
            required: true,
        },
        resolved: {
            type: Boolean,
            default: false,
        },
        uid: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Query", Query);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    street: { type: String, required: true },
    gst: { type: String },
    businessproof: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    token: {
        type: String,
    },
    granted_access: { type: Boolean, default: false },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
    },
});

module.exports = mongoose.model("User", User);

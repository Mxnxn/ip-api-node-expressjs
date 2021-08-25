const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Admin = new Schema({
    name: { type: String, required: "true" },
    phone: { type: String },
    email: { type: String, required: "true" },
    password: { type: String, required: "true" },
    firm: { type: String },
    address: { type: String },
    gst: { type: String },
    url: { type: String },
    account_no: { type: String },
    ifsc: {
        type: String,
    },
    bank_name: {
        type: String,
    },
    token: {
        type: String,
    },
});

module.exports = mongoose.model("Admin", Admin);

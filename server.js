const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const options = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
};
mongoose
    .connect(process.env.DB_URL, options)
    .then(() => {
        console.log(`Connected Mongodb!`);
    })
    .catch((err) => {
        console.log(`Error connecting Mongodb :`, err.message);
    });

const Admin = require("./routes/Admin");
const User = require("./routes/User");
const Product = require("./routes/Product");
const Category = require("./routes/Category");

app.get("/test", (req, res) => res.json({ message: "testing" }));
app.use("/admin", Admin);
app.use("/user", User);
app.use("/product", Product);
app.use("/category", Category);

app.listen(process.env.PORT, () => {
    console.log(`InvoiceMG has started on ${process.env.PORT}`);
});

const app = require("express").Router();
const upload = require("../Helpers/MulterConfig");
const { UserTokenHelper } = require("../Helpers/UserTokenHelper");
const { Login, Register } = require("./User/Auth");
const { getWalletWithHistory, addMoneyToWallet } = require("./User/Wallet");

app.use("/*", (req, res, next) => next());

// USER AUTH
app.post("/register", upload.single("businessProof"), Register);
app.post("/login", upload.none(), Login);

//WALLET API
app.get("/wallet/:uid", UserTokenHelper, getWalletWithHistory);
app.post("/wallet/add", UserTokenHelper, upload.single("receipt"), addMoneyToWallet);

module.exports = app;

const app = require("express").Router();
const upload = require("../Helpers/MulterConfig");
const { UserTokenHelper } = require("../Helpers/UserTokenHelper");
const { Login, Register } = require("./User/Auth");
const { getWalletWithHistory, addMoneyToWallet } = require("./User/Wallet");
const { GetUserForUser } = require("./User/Listing");
const { sendEmailToUser, resetPassword, CheckingToken } = require("./User/MailHandler");

app.use("/*", (req, res, next) => next());

// USER AUTH
app.post("/register", upload.single("businessProof"), Register);
app.post("/login", upload.none(), Login);

app.post("/forgetPassword", upload.none(), sendEmailToUser);

app.get("/:uid", UserTokenHelper, upload.none(), GetUserForUser);

app.post("/changePassword", upload.none(), resetPassword);

app.get("/forgetPassword/:token", CheckingToken);

//WALLET API
app.get("/wallet/:uid", UserTokenHelper, getWalletWithHistory);
app.post("/wallet/add", UserTokenHelper, upload.single("receipt"), addMoneyToWallet);

module.exports = app;

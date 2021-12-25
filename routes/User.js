const app = require("express").Router();
const upload = require("../Helpers/MulterConfig");
const uploadDynamic = require("../Helpers/DynamicMulterDest");
const uploadCDR = require("../Helpers/Multer/UploadCDR");
const { UserTokenHelper } = require("../Helpers/UserTokenHelper");
const { Login, Register } = require("./User/Auth");
const { getWalletWithHistory, addMoneyToWallet } = require("./User/Wallet");
const { addItemToCart, getCartWithItems, removeItemsFromCart } = require("./User/Cart");
const { GetUserForUser, UpdateUserDetail } = require("./User/Listing");
const { sendEmailToUser, resetPassword, CheckingToken } = require("./User/MailHandler");

app.use("/*", (req, res, next) => next());

// USER AUTH
app.post("/register", uploadDynamic("businessproofs/").single("businessProof"), Register);
app.post("/login", upload.none(), Login);

app.post("/forgetPassword", upload.none(), sendEmailToUser);

app.get("/:uid", UserTokenHelper, upload.none(), GetUserForUser);
app.post("/:uid", UserTokenHelper, upload.none(), UpdateUserDetail);

app.post("/changePassword", upload.none(), resetPassword);

app.get("/forgetPassword/:token", CheckingToken);

//WALLET API
app.get("/wallet/:uid", UserTokenHelper, getWalletWithHistory);
app.post("/wallet/add", UserTokenHelper, uploadDynamic("requests/").single("receipt"), addMoneyToWallet);

// CART API
app.get("/cart/:uid", UserTokenHelper, upload.none(), getCartWithItems);
app.post("/cart/add", UserTokenHelper, uploadCDR("designs/").single("designFile"), addItemToCart);
app.post("/cart/remove", UserTokenHelper, upload.none(), removeItemsFromCart);

module.exports = app;

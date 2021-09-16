const app = require("express").Router();
const upload = require("../Helpers/MulterConfig");
const { UserTokenHelper } = require("../Helpers/UserTokenHelper");
const { Login, Register } = require("./User/Auth");
const { getWalletWithHistory, addMoneyToWallet } = require("./User/Wallet");

app.use("/*", (req, res, next) => next());

/**
 * @GET All Orders to @ADMIN
 * @GET Order Detail to @ADMIN & @User
 * @POST Make Order to @USER
 * @GET View Previous/Ongoing Order to @USER
 * @POST Cancel Order to @USER & @ADMIN
 * @POST Activate/Disable Product
 */

module.exports = app;

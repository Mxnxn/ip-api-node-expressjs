const app = require("express").Router();
const upload = require("../Helpers/MulterConfig");
const { UserTokenHelper } = require("../Helpers/UserTokenHelper");
const { Login, Register } = require("./User/Auth");
const { getWalletWithHistory, addMoneyToWallet } = require("./User/Wallet");

app.use("/*", (req, res, next) => next());

/**
 * @GET COUPONS to @ADMIN
 * @GET Coupons Details to @ADMIN
 * @GET Coupons Descrptive to @USER
 * @POST Add Coupon to @ADMIN
 * @POST Edit Coupon to @ADMIN
 * @POST Delete Coupon to @ADMIN
 * @POST Activate/Disable Coupon to @ADMIN
 * @POST Apply Coupon to @USER
 */

module.exports = app;

const app = require("express").Router();
const { TokenHelper } = require("../Helpers/TokenHelper");
const upload = require("../Helpers/MulterConfig");
const uploadDynamic = require("../Helpers/DynamicMulterDest")("products/");
const { Login, Register } = require("./Admin/Auth");
const { addCategory, editCategory, deleteCategory } = require("./Admin/Category");
const { GetUsers, GetUser, RestrictUser, ActivateUser } = require("./Admin/Listing");
const { addProduct, editProductDetails, deleteProduct, editProductImages, deleteProductImages } = require("./Admin/Product");
const { addMoneyToWallet, rejectMoneyAddtion, getRequests } = require("./Admin/Wallet");

app.use("/*", (req, res, next) => next());

// ADMIN AUTH
app.post("/login", upload.none(), Login);
// app.post("/register", upload.none(), Register);

// ADMIN UserList
app.get("/users", TokenHelper, upload.none(), GetUsers);
app.get("/user/:uid", TokenHelper, upload.none(), GetUser);
app.get("/user/restrict/:uid", TokenHelper, upload.none(), RestrictUser);
app.get("/user/activate/:uid", TokenHelper, upload.none(), ActivateUser);

// ADMIN ADD/REJECT MONEY TO WALLET
app.post("/add/towallet", TokenHelper, upload.none(), addMoneyToWallet);
app.post("/add/reject", TokenHelper, upload.none(), rejectMoneyAddtion);
// ADMIN GET ALL REQUESTS
app.get("/wallet/requests/:page", TokenHelper, upload.none(), getRequests);
// ADMIN CATEGORY
app.post("/category/add", TokenHelper, upload.none(), addCategory);
app.post("/category/edit", TokenHelper, upload.none(), editCategory);
app.get("/category/delete/:id", TokenHelper, upload.none(), deleteCategory);

// ADMIN PRODUCT
app.post("/product/add", TokenHelper, uploadDynamic.array("photos", 5), addProduct);
app.post("/product/edit", TokenHelper, upload.none(), editProductDetails);
app.post("/product/add/images", TokenHelper, uploadDynamic.array("photos", 5), editProductImages);
app.post("/product/delete/images", TokenHelper, upload.none(), deleteProductImages);
app.get("/product/delete/:id", TokenHelper, upload.none(), deleteProduct);

module.exports = app;

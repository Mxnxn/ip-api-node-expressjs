const app = require("express").Router();
const { ResponseBodyError } = require("../Helpers/BodyError");
const upload = require("../Helpers/MulterConfig");
const { Response } = require("../Helpers/Response");
const { TokenHelper } = require("../Helpers/TokenHelper");
const { UserTokenHelper } = require("../Helpers/UserTokenHelper");
const Product = require("../Model/Product");
const { AddBanner, DeleteBanner } = require("./Product/Banner");
const { Login, Register } = require("./User/Auth");
const { getWalletWithHistory, addMoneyToWallet } = require("./User/Wallet");
const { ChangeVisibility } = require("./Admin/Product");
const Category = require("../Model/Category");
app.use("/*", (req, res, next) => next());

/**
 * @GET Products
 * @GET Product Detail
 * @GET Banners
 * @POST Add Banners
 * @POST Delete Banners
 * @POST Add Product
 * @POST Edit Product
 * @POST Delete Product
 * @POST Activate/Disable Product
 */

app.post("/add/banner", TokenHelper, upload.single("bannerImage"), AddBanner);
app.post("/delete/banner", TokenHelper, upload.none(), DeleteBanner);
app.get("/changeVisibility/:id", TokenHelper, upload.none(), ChangeVisibility);
app.get("/  ", async (req, res) => {
    const products = await Product.find({})
        .populate({ path: "category", select: ["name", "_id"] })
        .populate({ path: "images" });
    return Response(res, 200, products);
});
app.get("/getAll/:limit", async (req, res) => {
    try {
        if (!req.params.limit) return Response(res, 400, ["Product limit missing in body"]);
        const products = await Product.find({}, { limit: req.params.limit })
            .select(["images", "category", "name", "price"])
            .populate({ path: "category" })
            .populate({ path: "images" });
        return Response(res, 200, products);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error"]);
    }
});

app.get("/getAll", async (req, res) => {
    try {
        const products = await Product.find({}).populate({ path: "category" }).populate({ path: "images" });
        return Response(res, 200, products);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error"]);
    }
});

app.get("/get/:id", async (req, res) => {
    if (!req.params.id) return Response(res, 400, ["Product id missing in body"]);
    const product = await Product.findById(req.params.id).populate({ path: "category" }).populate({ path: "images" });
    return Response(res, 200, product);
});

app.get("/cat/:id", async (req, res) => {
    if (!req.params.id) return Response(res, 400, ["Category id missing in body"]);
    const cate = await Category.findById(req.params.id);
    const product = await Product.find({ category: { $in: req.params.id } })
        .populate({ path: "category" })
        .populate({ path: "images" });
    return Response(res, 200, { products: product, category: cate });
});

module.exports = app;

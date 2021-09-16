const app = require("express").Router();

const { Response } = require("../Helpers/Response");

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

app.get("/getAll", async (req, res) => {
    const products = await Category.find({});
    return Response(res, 200, products);
});
app.get("/getAll/:limit", async (req, res) => {
    try {
        if (!req.params.limit) return Response(res, 400, ["Product limit missing in body"]);
        const products = await Category.find({}, { limit: req.params.limit }).select(["name", "_id"]);
        return Response(res, 200, products);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error"]);
    }
});

module.exports = app;

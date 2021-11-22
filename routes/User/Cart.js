const { Response } = require("../../Helpers/Response");
const { ResponseBodyError } = require("../../Helpers/BodyError");
const User = require("../../Model/User");
const { AddCartProductSchema } = require("../../Helpers/JoiVerifier");
const Product = require("../../Model/Product");
const CartProduct = require("../../Model/Cart/CartProduct");
const Cart = require("../../Model/Cart/Cart");

const addItemToCart = async (req, res) => {
    try {
        const { error, value } = await AddCartProductSchema.validate(req.body);
        if (error) return ResponseBodyError(res, error);
        if (!req.file) return ResponseBodyError(res, { details: [{ message: "Upload Design for the Job!" }] });
        const mProduct = await Product.findById(value.pid);
        const mCartProduct = await new CartProduct({
            id: mProduct.id,
            name: mProduct.name,
            price: mProduct.price,
            description: mProduct.description,
            category: mProduct.category,
            gsmOrMicron: mProduct.gsmOrMicron,
            isAvailable: mProduct.isAvailable,
            sizeWithQty: mProduct.sizeWithQty,
            numericPrice: mProduct.numericPrice,
            sizes: mProduct.sizes,
            eyelets: mProduct.eyelets,
            images: mProduct.images,
            len: value.len,
            height: value.height,
            rate: value.rate,
            designFile: image.destination + image.filename,
            uid: value.uid,
        }).save();
        await Cart.findOneAndUpdate({ uid: value.uid }, { product: { $push: mCartProduct._id } });
        return Response(res, 200, ["Following Request Rejected"]);
    } catch (err) {
        return Response(res, 500, ["Internal Error!"]);
    }
};

const getCartWithItems = async (req, res) => {
    if (!req.body.uid) return Response(res, 400, ["Missing Body. Bad Request."]);
    const mCart = await Cart.findOne({ uid: req.body.uid }).populate("product");
    return Response(res, 200, mCart);
};

module.exports = { addItemToCart, getCartWithItems };

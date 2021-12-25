const { Response } = require("../../Helpers/Response");
const { ResponseBodyError } = require("../../Helpers/BodyError");
const User = require("../../Model/User");
const { AddCartProductSchema } = require("../../Helpers/JoiVerifier");
const Product = require("../../Model/Product");
const CartProduct = require("../../Model/Cart/CartProduct");
const Cart = require("../../Model/Cart/Cart");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const addItemToCart = async (req, res) => {
    try {
        const { error, value } = await AddCartProductSchema.validate(req.body);
        if (error) return ResponseBodyError(res, error);
        if (!req.file) return ResponseBodyError(res, { details: [{ message: "Upload Design for the Job!" }] });
        const mProduct = await Product.findById(value.pid);
        const mCartProduct = new CartProduct({
            name: value.name,
            price: value.price,
            description: value.description,
            gsmOrMicron: value.gsmOrMicron,
            numericPrice: value.numericPrice,
            category: value.category,
            images: value.images,
            eyelets: value.eyelets,
            len: value.len,
            height: value.height,
            qty: value.qty,
            rate: value.rate,
            designFile: req.file.destination + req.file.filename,
            uid: value.uid,
        });
        await Cart.findOneAndUpdate({ uid: value.uid }, { $push: { products: mCartProduct._id } });
        mCartProduct.save();
        return Response(res, 200, ["Added successfully!"]);
    } catch (err) {
        console.log(err);
        return Response(res, 500, ["Internal Error!"]);
    }
};

const getCartWithItems = async (req, res) => {
    try {
        if (!req.params.uid) return Response(res, 400, ["Bad Request."]);
        const mCart = await Cart.findOne({ uid: req.params.uid }).populate({ path: "products", populate: { path: "images", select: ["url", "path"] } });

        return Response(res, 200, mCart);
    } catch (err) {
        console.log(err);
        return Response(res, 500, ["Internal Error!"]);
    }
};
/**
 * cpid -> cartproductid
 */
const removeItemsFromCart = async (req, res) => {
    try {
        if (!req.body.uid || !req.body.cpid) return Response(res, 400, ["Bad Request."]);
        const mCartProduct = await CartProduct.findByIdAndDelete(req.body.cpid);
        await unlinkAsync(mCartProduct.designFile);
        const mUpdatedCart = await Cart.findOneAndUpdate({ uid: req.body.uid }, { $pull: { products: mCartProduct._id } }).populate({
            path: "products",
            populate: { path: "images", select: ["url", "path"] },
        });
        return Response(res, 200, mUpdatedCart);
    } catch (err) {
        console.log(err);
        return Response(res, 500, ["Internal Error!"]);
    }
};

module.exports = { addItemToCart, getCartWithItems, removeItemsFromCart };

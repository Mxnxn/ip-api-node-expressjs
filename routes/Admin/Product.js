const { Response } = require("../../Helpers/Response");
const { ResponseBodyError } = require("../../Helpers/BodyError");
const Category = require("../../Model/Category");
const Product = require("../../Model/Product");
const Variant = require("../../Model/Variant");
const { AddProductSchema } = require("../../Helpers/JoiVerifier");
const ImageBucket = require("../../Model/ImageBucket");
const { FilePathHelper } = require("../../Helpers/FilePathHelper");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const AllProducts = require("../../Model/AllProducts");

const addProduct = async (req, res) => {
    try {
        const { value, error } = await AddProductSchema.validate(req.body);
        if (error) return ResponseBodyError(res, error);
        if (req.files.length < 1) return Response(res, 400, ["Please Add Alteast 1 Image"]);
        const mProduct = await new Product({
            name: value.name,
            description: value.description,
            gsmOrMicron: value.gsmOrMicron,
            price: value.price,
            numericPrice: value.numericPrice,
            images: [],
            isAvailable: value.isAvailable,
            category: value.category,
            sizes: value.sizes,
            sizeWithQty: value.sizeWithQty,
            eyelets: value.eyelets,
        });

        let imageArr = [];
        for (let i = 0; i < req.files.length; i++) {
            const image = req.files[i];
            const mImages = await new ImageBucket({
                url: image.destination + image.filename,
                path: image.path,
                product: mProduct._id,
            }).save();
            imageArr.push(mImages._id);
        }
        mProduct.images = imageArr;
        await mProduct.save();
        return Response(res, 200, ["Successfully Added"]);
    } catch (error) {
        return Response(res, 500, ["Internal Error!"]);
    }
};

const editProductDetails = async (req, res) => {
    try {
        const { value, error } = await AddProductSchema.validate(req.body);
        if (error) ResponseBodyError(res, error);

        await Product.findByIdAndUpdate(value.id, {
            name: value.name,
            description: value.description,
            gsmOrMicron: value.gsmOrMicron,
            price: value.price,
            category: value.category,
            isAvailable: value.isAvailable,
            sizeWithQty: value.sizeWithQty,
            sizes: value.sizes,
            eyelets: value.eyelets,
        });

        return Response(res, 200, ["Successfully Updated."]);
    } catch (error) {
        for (let index = 0; index < req.files.length; index++) {
            const prod = req.files[index];
            await unlinkAsync(prod.path);
            await ImageBucket.findOneAndDelete({ path: prod.path });
        }
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};

const editProductImages = async (req, res) => {
    try {
        if (!req.body.id) return Response(res, 500, ["Something went wrong!"]);
        if (req.files.length < 1) return Response(res, 500, ["Upload atleast 1 Image"]);
        const mProduct = await Product.findById(req.body.id);
        const mAllProduct = await AllProduct.find({ product: req.body.id });
        let imageArr = [];
        let populatedArr = [];
        for (let i = 0; i < req.files.length; i++) {
            const image = req.files[i];
            const mImages = await new ImageBucket({
                url: image.destination + image.filename,
                path: image.path,
                product: mProduct._id,
            }).save();
            imageArr.push(mImages._id);
            populatedArr.push(mImages);
        }
        const temp = mProduct.images;
        mProduct.images = temp.concat(imageArr);
        mAllProduct.images = temp.concat(imageArr);
        await mProduct.save();
        await mAllProduct.save();
        return Response(res, 200, ["Successfully Updated!"]);
    } catch (error) {
        for (let index = 0; index < req.files.length; index++) {
            const prod = req.files[index];
            await unlinkAsync(prod.path);
            await ImageBucket.findOneAndDelete({ path: prod.path });
        }
        return Response(res, 500, ["Internal Error!"]);
    }
};

const deleteProduct = async (req, res) => {
    try {
        if (!req.params.id) return Response(res, 400, ["Product Id missing."]);
        await Product.findByIdAndDelete(req.params.id);
        return Response(res, 200, ["Successfully Deleted"]);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};

const deleteProductImages = async (req, res) => {
    try {
        if (!req.body.id || !req.body.iid) return Response(res, 400, ["Product Id missing."]);
        const mImage = await ImageBucket.findById(req.body.iid);
        await unlinkAsync(mImage.path);
        await ImageBucket.findByIdAndDelete(req.body.iid);
        await Product.findByIdAndUpdate(req.body.id, { $pull: { images: req.body.iid } }).populate("images");
        await AllProduct.findOneAndUpdate({ product: req.body.id }, { $pull: { images: req.body.iid } }).populate("images");
        return Response(res, 200, ["Successfully Deleted"]);
    } catch (error) {
        for (let index = 0; index < req.files.length; index++) {
            const prod = req.files[index];
            await unlinkAsync(prod.path);
        }
        return Response(res, 500, ["Internal Error!"]);
    }
};

const ChangeVisibility = async (req, res) => {
    try {
        if (!req.params.id) Response(res, 400, ["Product Id missing."]);
        const mProduct = await Product.findById(req.params.id);
        mProduct.isAvailable = !mProduct.isAvailable;
        mProduct.save();
        return Response(res, 200, ["Status successfully changed"]);
    } catch (error) {
        return Response(res, 500, ["Internal Error!"]);
    }
};

const AddVariant = async (req, res) => {
    try {
        if (!req.body.variant || req.body.variant.length < 1) {
            return Response(res, 404, ["Add Alteast 1 Variant to Product Before Save"]);
        }
        const variants = req.body.variant;
        for (let index = 0; index < variants.length; index++) {
            const variant = JSON.parse(variants[index]);
            const mVariant = await new Variant({
                pid: variant.pid,
                name: variant.name,
                details: variant.details,
                price: variant.price,
                numericPrice: variant.numericPrice,
            }).save();
            await Product.findByIdAndUpdate(variant.pid, { $push: { variants: mVariant._id }, haveVariants: true });
        }
        return Response(res, 200, ["Variants Successfully Added"]);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};
const EditVariant = async (req, res) => {
    try {
        if (!req.body._id || !req.body.details || !req.body.price || !req.body.numericPrice || !req.body.name) {
            return Response(res, 401, ["Enter Details Properly to Update Variant!"]);
        }
        await Variant.findByIdAndUpdate(req.body._id, {
            name: req.body.name,
            details: req.body.details,
            price: req.body.price,
            numericPrice: req.body.numericPrice,
        });
        return Response(res, 200, ["Variant Successfully Updated"]);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};
const DeleteVariant = async (req, res) => {
    try {
        if (!req.body._id || !req.body.pid) {
            return Response(res, 404, ["Missing Body!"]);
        }
        await Variant.findByIdAndDelete(req.body._id);
        const mProducts = await Product.findById(req.body.pid);
        if (mProducts.variants.length < 1) {
            await Product.findByIdAndUpdate(req.body.pid, { $pull: { variants: req.body._id }, hasVariants: false });
        } else {
            await Product.findByIdAndUpdate(req.body.pid, { $pull: { variants: req.body._id } });
        }
        return Response(res, 200, ["Variant Successfully Updated"]);
    } catch (error) {
        console.log(error);
        return Response(res, 500, ["Internal Error!"]);
    }
};

module.exports = {
    addProduct,
    deleteProduct,
    editProductDetails,
    editProductImages,
    deleteProductImages,
    ChangeVisibility,
    AddVariant,
    EditVariant,
    DeleteVariant,
};

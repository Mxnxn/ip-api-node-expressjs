const { Response } = require("../../Helpers/Response");
const { ResponseBodyError } = require("../../Helpers/BodyError");
const Category = require("../../Model/Category");
const Product = require("../../Model/Product");
const addCategory = async (req, res) => {
    try {
        if (!req.body.name) {
            return ResponseBodyError(res, { details: [{ message: "Category Name is missing!" }] });
        }
        const mCat = await new Category({
            name: req.body.name,
        }).save();
        return Response(res, 200, "SuccessFully Added");
    } catch (error) {
        return Response(res, 500, ["Internal Error!"]);
    }
};
const editCategory = async (req, res) => {
    try {
        if (!req.body.cat || !req.body.name) {
            return ResponseBodyError(res, { details: [{ message: "Something is missing!" }] });
        }
        await Category.findByIdAndUpdate(req.body.cat, {
            name: req.body.name,
        });
        return Response(res, 200, ["Successfully Edited"]);
    } catch (error) {
        return Response(res, 500, ["Internal Error!"]);
    }
};

const deleteCategory = async (req, res) => {
    try {
        if (!req.params.id) {
            return ResponseBodyError(res, { details: [{ message: "Id is missing!" }] });
        }
        await Category.findByIdAndDelete(req.params.id);
        const Products = await Product.find({ category: req.body.cat });
        for (let index = 0; index < Products.length; index++) {
            const prod = Products[index];
            prod.category = null;
            prod.save();
        }
        return Response(res, 200, "Successfully Deleted!");
    } catch (error) {
        return Response(res, 500, ["Internal Error!"]);
    }
};

module.exports = {
    addCategory,
    deleteCategory,
    editCategory,
};

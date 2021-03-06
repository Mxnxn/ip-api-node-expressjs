const Joi = require("joi");

const AdminAuthSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
    password: Joi.string().required(),
});

const UserRegistrationSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
        .required(),
    password: Joi.string().min(6).max(30).required(),
    name: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
    companyName: Joi.string().required(),
    phone: Joi.string().length(10).required(),
    landmark: Joi.string(),
    businessProof: Joi.allow(),
});
const UserUpdationSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
    companyName: Joi.string().required(),
    phone: Joi.string().length(10).required(),
    landmark: Joi.string(),
});

const UserLoginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
        .required(),
    password: Joi.string().min(6).max(30).required(),
});

const AddWalletMoneySchema = Joi.object({
    amount: Joi.number().required(),
    uid: Joi.string().required(),
});

const GrantMoneySchema = Joi.object({
    uid: Joi.string().required(),
    bhid: Joi.string().required(),
});

const RejectMoneyAdditionSchema = Joi.object({
    uid: Joi.string().required(),
    bhid: Joi.string().required(),
    reason: Joi.string().required(),
});

const AddBannerSchema = Joi.object({
    alt: Joi.string().required(),
    product: Joi.string().required(),
});

const AddProductSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string().required(),
    price: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.array().items(Joi.string()).required(),
    gsmOrMicron: Joi.number(),
    isAvailable: Joi.boolean(),
    sizeWithQty: Joi.boolean(),
    numericPrice: Joi.number(),
    sizes: Joi.array().items(Joi.number()),
    eyelets: Joi.boolean(),
});

const AddCartProductSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.array().items(Joi.string()).required(),
    images: Joi.array().items(Joi.string()).required(),
    gsmOrMicron: Joi.number(),
    numericPrice: Joi.number(),
    eyelets: Joi.boolean(),
    uid: Joi.string(),
    pid: Joi.string(),
    qty: Joi.number(),
    rate: Joi.number(),
    len: Joi.number(),
    height: Joi.number(),
    designFile: Joi.allow(),
});

module.exports = {
    AdminAuthSchema,
    AddBannerSchema,
    UserRegistrationSchema,
    UserLoginSchema,
    AddWalletMoneySchema,
    GrantMoneySchema,
    RejectMoneyAdditionSchema,
    AddProductSchema,
    AddCartProductSchema,
    UserUpdationSchema,
};

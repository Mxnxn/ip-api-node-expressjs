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
    confirmPassword: Joi.string().min(6).max(30).required(),
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

module.exports = { AdminAuthSchema, UserRegistrationSchema, UserLoginSchema, AddWalletMoneySchema };

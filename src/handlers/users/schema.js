const Joi = require("joi");

// Schema validasi menggunakan Joi untuk registrasi
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": `"username" must only contain letters and numbers`,
    "string.base": `"username" must be a string`,
    "string.min": `"username" must have at least 3 characters`,
    "string.max": `"username" must have at most 30 characters`,
    "any.required": `"username" is required`,
  }),
  fullName: Joi.string().min(3).max(50).required().messages({
    "string.base": `"fullName" must be a string`,
    "string.min": `"fullName" must have at least 3 characters`,
    "string.max": `"fullName" must have at most 50 characters`,
    "any.required": `"fullName" is required`,
  }),
  email: Joi.string().email().required().messages({
    "string.base": `"email" must be a string`,
    "string.email": `"email" is not valid`,
    "any.required": `"email" is required`,
  }),
  password: Joi.string().alphanum().min(6).required().messages({
    "string.alphanum": `"password" must only contain letters and numbers`,
    "string.base": `"password" must be a string`,
    "string.min": `"password" must have at least 6 characters`,
    "any.required": `"password" is required`,
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": `"confirmPassword" must match "password"`,
    "any.required": `"confirmPassword" is required`,
  }),
});

// Schema validasi menggunakan Joi untuk login
const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": `"username" must only contain letters and numbers`,
    "string.base": `"username" must be a string`,
    "string.min": `"username" must have at least 3 characters`,
    "string.max": `"username" must have at most 30 characters`,
    "any.required": `"username" is required`,
  }),
  password: Joi.string().alphanum().min(6).required().messages({
    "string.alphanum": `"password" must only contain letters and numbers`,
    "string.base": `"password" must be a string`,
    "string.min": `"password" must have at least 6 characters`,
    "any.required": `"password" is required`,
  }),
});

// Schema validasi menggunakan Joi untuk lupa password
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `"email" must be a string`,
    "string.email": `"email" is not valid`,
    "any.required": `"email" is required`,
  }),
});

// Schema validasi menggunakan Joi untuk reset password
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `"email" must be a string`,
    "string.email": `"email" is not valid`,
    "any.required": `"email" is required`,
  }),
  resetCode: Joi.string().required().messages({
    "string.base": `"resetCode" must be a string`,
    "any.required": `"resetCode" is required`,
  }),
  newPassword: Joi.string().alphanum().min(6).required().messages({
    "string.alphanum": `"newPassword" must only contain letters and numbers`,
    "string.base": `"newPassword" must be a string`,
    "string.min": `"newPassword" must have at least 6 characters`,
    "any.required": `"newPassword" is required`,
  }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": `"confirmPassword" must match "newPassword"`,
      "any.required": `"confirmPassword" is required`,
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};

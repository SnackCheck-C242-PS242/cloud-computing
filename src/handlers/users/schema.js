const Joi = require("joi");

// Schema validasi menggunakan Joi untuk registrasi
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": `"username" hanya boleh terdiri dari huruf dan angka`,
    "string.base": `"username" harus berupa string`,
    "string.min": `"username" minimal memiliki 3 karakter`,
    "string.max": `"username" maksimal memiliki 30 karakter`,
    "any.required": `"username" harus diisi`,
  }),
  email: Joi.string().email().required().messages({
    "string.base": `"email" harus berupa string`,
    "string.email": `"email" tidak valid`,
    "any.required": `"email" harus diisi`,
  }),
  password: Joi.string().alphanum().min(3).required().messages({
    "string.alphanum": `"password" hanya boleh terdiri dari huruf dan angka`,
    "string.base": `"password" harus berupa string`,
    "string.min": `"password" minimal memiliki 3 karakter`,
    "any.required": `"password" harus diisi`,
  }),
});

// Schema validasi menggunakan Joi untuk login
const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": `"username" hanya boleh terdiri dari huruf dan angka`,
    "string.base": `"username" harus berupa string`,
    "string.min": `"username" minimal memiliki 3 karakter`,
    "string.max": `"username" maksimal memiliki 30 karakter`,
    "any.required": `"username" harus diisi`,
  }),
  password: Joi.string().alphanum().min(3).required().messages({
    "string.alphanum": `"password" hanya boleh terdiri dari huruf dan angka`,
    "string.base": `"password" harus berupa string`,
    "string.min": `"password" minimal memiliki 3 karakter`,
    "any.required": `"password" harus diisi`,
  }),
});

// Schema validasi menggunakan Joi untuk lupa password
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `"email" harus berupa string`,
    "string.email": `"email" tidak valid`,
    "any.required": `"email" harus diisi`,
  }),
});

// Schema validasi menggunakan Joi untuk reset password
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `"email" harus berupa string`,
    "string.email": `"email" tidak valid`,
    "any.required": `"email" harus diisi`,
  }),
  resetCode: Joi.string().length(6).required().messages({
    "string.base": `"resetCode" harus berupa string`,
    "string.length": `"resetCode" harus memiliki 6 karakter`,
    "any.required": `"resetCode" harus diisi`,
  }),
  newPassword: Joi.string().alphanum().min(3).required().messages({
    "string.alphanum": `"newPassword" hanya boleh terdiri dari huruf dan angka`,
    "string.base": `"newPassword" harus berupa string`,
    "string.min": `"newPassword" minimal memiliki 3 karakter`,
    "any.required": `"newPassword" harus diisi`,
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};

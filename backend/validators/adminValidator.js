const Joi = require("joi");

const registerAdminSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),

  email: Joi.string().trim().email().required(),

  password: Joi.string().min(6).max(30).required(),
});

const loginAdminSchema = Joi.object({
  email: Joi.string().trim().email().required(),

  password: Joi.string().required(),
});

module.exports = {
  registerAdminSchema,
  loginAdminSchema,
};

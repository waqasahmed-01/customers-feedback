const Joi = require("joi");

const sendFeedbackSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),

  email: Joi.string().trim().email().required(),
});

module.exports = {
  sendFeedbackSchema,
};

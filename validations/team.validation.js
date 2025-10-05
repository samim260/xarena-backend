const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message(`"${value}" is not a valid ObjectId`);
  }
  return value;
};

const createTeamSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  tag: Joi.string().trim().max(10).required(),
  logo_url: Joi.string().uri().optional(),
  banner_url: Joi.string().uri().optional(),
  region: Joi.string().max(50).optional(),
  bio: Joi.string().max(500).optional()
});

const updateTeamSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  tag: Joi.string().trim().max(10).optional(),
  logo_url: Joi.string().uri().optional(),
  banner_url: Joi.string().uri().optional(),
  region: Joi.string().max(50).optional(),
  bio: Joi.string().max(500).optional()
});


module.exports = {createTeamSchema, updateTeamSchema}
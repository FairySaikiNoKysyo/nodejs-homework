import Joi from "joi";
export const addContactScheme = Joi.object({name:Joi.string().required(),email:Joi.string().required(),phone:Joi.string().required()}).messages({
    "any.required": 'missing required "{#label}" field',
});
export const updateContactScheme = Joi.object({name:Joi.string(),email:Joi.string(),phone:Joi.string()});


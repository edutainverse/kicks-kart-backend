import Joi from 'joi';

export const CartSchemas = {
  add: { root: Joi.object({ body: Joi.object({ productId: Joi.string().required(), size: Joi.string().required(), qty: Joi.number().integer().min(1).required() }) }), body: true },
  update: { root: Joi.object({ params: Joi.object({ itemId: Joi.string().required() }), body: Joi.object({ qty: Joi.number().integer().min(1).required() }) }), body: true, params: true },
  remove: { root: Joi.object({ params: Joi.object({ itemId: Joi.string().required() }) }), params: true },
};

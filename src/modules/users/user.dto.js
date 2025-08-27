import Joi from 'joi';

export const UserSchemas = {
  updateRole: { root: Joi.object({ body: Joi.object({ role: Joi.string().valid('user','admin').required() }), params: Joi.object({ id: Joi.string().required() }) }), body: true, params: true },
};

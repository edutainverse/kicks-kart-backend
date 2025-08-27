import Joi from 'joi';

const body = {
  signup: Joi.object({ name: Joi.string().min(2).required(), email: Joi.string().email().required(), password: Joi.string().min(8).required() }),
  login: Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() }),
};

export const AuthSchemas = {
  signup: { root: Joi.object({ body: body.signup }), body: true },
  login: { root: Joi.object({ body: body.login }), body: true },
  empty: { root: Joi.object({ body: Joi.object().optional() }), body: true },
};

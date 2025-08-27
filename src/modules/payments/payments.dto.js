import Joi from 'joi';

export const PaymentSchemas = {
  webhook: { root: Joi.object({ body: Joi.object({ paymentIntentId: Joi.string().required(), outcome: Joi.string().valid('succeeded','failed').required() }) }), body: true },
};

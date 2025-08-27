import Joi from 'joi';

export const AdminSchemas = {
  patchUser: { root: Joi.object({ params: Joi.object({ id: Joi.string().required() }), body: Joi.object({ role: Joi.string().valid('user','admin').optional() }) }), body: true, params: true },
  listOrders: { root: Joi.object({ query: Joi.object({ status: Joi.string().valid('pending','paid','shipped','delivered','canceled').optional() }) }), query: true },
  patchOrder: { root: Joi.object({ params: Joi.object({ id: Joi.string().required() }), body: Joi.object({ status: Joi.string().valid('shipped','delivered','canceled').required() }) }), body: true, params: true },
  createProduct: { root: Joi.object({ body: Joi.object({ slug: Joi.string().required(), title: Joi.string().required(), description: Joi.string().allow('').optional(), brand: Joi.string().allow('').optional(), price: Joi.number().required(), images: Joi.array().items(Joi.string()).default([]), sizes: Joi.array().items(Joi.string()).default([]), category: Joi.string().valid('sneakers','running','casual','formal','kids').required(), active: Joi.boolean().default(true), }) }), body: true },
  updateProduct: { root: Joi.object({ params: Joi.object({ id: Joi.string().required() }), body: Joi.object({ title: Joi.string(), description: Joi.string().allow(''), brand: Joi.string().allow(''), price: Joi.number(), images: Joi.array().items(Joi.string()), sizes: Joi.array().items(Joi.string()), category: Joi.string().valid('sneakers','running','casual','formal','kids'), active: Joi.boolean() }) }), body: true, params: true },
  patchInventory: { root: Joi.object({ params: Joi.object({ productId: Joi.string().required() }), body: Joi.object({ variants: Joi.array().items(Joi.object({ size: Joi.string().required(), stock: Joi.number().integer().min(0).required() })) }) }), body: true, params: true },
};

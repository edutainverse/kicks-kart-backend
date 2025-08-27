import Joi from 'joi';

export const ProductSchemas = {
  list: { root: Joi.object({
    query: Joi.object({
      search: Joi.string().allow('').optional(),
      category: Joi.string().valid('sneakers','running','casual','formal','kids').optional(),
      size: Joi.string().optional(),
      min: Joi.number().optional(),
      max: Joi.number().optional(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(12),
    })
  }), query: true },
  create: { root: Joi.object({ body: Joi.object({
    slug: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    brand: Joi.string().allow('').optional(),
    price: Joi.number().required(),
    images: Joi.array().items(Joi.string()).default([]),
    sizes: Joi.array().items(Joi.string()).default([]),
    category: Joi.string().valid('sneakers','running','casual','formal','kids').required(),
    active: Joi.boolean().default(true),
  }) }), body: true },
  update: { root: Joi.object({ body: Joi.object({
    title: Joi.string(), description: Joi.string().allow(''), brand: Joi.string().allow(''), price: Joi.number(), images: Joi.array().items(Joi.string()), sizes: Joi.array().items(Joi.string()), category: Joi.string().valid('sneakers','running','casual','formal','kids'), active: Joi.boolean(),
  }), params: Joi.object({ id: Joi.string().required() }) }), body: true, params: true },
  byId: { root: Joi.object({ params: Joi.object({ idOrSlug: Joi.string().required() }) }), params: true },
};

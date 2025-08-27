import Product from './product.model.js';
import Inventory from '../inventory/inventory.model.js';
import mongoose from 'mongoose';

export async function list(query) {
  const { search, category, size, min, max, page = 1, limit = 12 } = query;
  const filter = {};
  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (min != null || max != null) filter.price = { ...(min != null ? { $gte: Number(min) } : {}), ...(max != null ? { $lte: Number(max) } : {}) };
  if (size) {
    // match products that have this size, or inventory variant present
    filter.sizes = size;
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Product.countDocuments(filter),
  ]);
  return { items, total };
}

export async function getByIdOrSlug(idOrSlug) {
  let product = null;
  if (mongoose.isValidObjectId(idOrSlug)) {
    product = await Product.findById(idOrSlug).lean();
  }
  if (!product) product = await Product.findOne({ slug: idOrSlug }).lean();
  if (!product) return null;
  const inv = await Inventory.findOne({ productId: product._id }).lean();
  return { ...product, inventory: inv?.variants || [] };
}

export async function create(data) {
  return Product.create(data);
}

export async function update(id, data) {
  return Product.findByIdAndUpdate(id, data, { new: true });
}

export async function remove(id) {
  await Product.findByIdAndDelete(id);
}

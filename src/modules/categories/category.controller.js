import Category from './category.model.js';
import { invalidateCache } from '../../middlewares/cache.js';

export async function listCategories(req, res, next) {
  try {
    const cats = await Category.find().lean();
    res.json(cats);
  } catch (e) { next(e); }
}

export async function getCategory(req, res, next) {
  try {
    const cat = await Category.findById(req.params.id).lean();
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (e) { next(e); }
}

export async function createCategory(req, res, next) {
  try {
    const cat = await Category.create(req.body);
    // Invalidate category caches
    await invalidateCache(['categories:*']);
    res.status(201).json(cat);
  } catch (e) { next(e); }
}

export async function updateCategory(req, res, next) {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // Invalidate category caches
    await invalidateCache(['categories:*']);
    res.json(cat);
  } catch (e) { next(e); }
}

export async function deleteCategory(req, res, next) {
  try {
    await Category.findByIdAndDelete(req.params.id);
    // Invalidate category caches
    await invalidateCache(['categories:*']);
    res.status(204).end();
  } catch (e) { next(e); }
}

import Inventory from './inventory.model.js';

export async function getByProduct(productId) {
  return Inventory.findOne({ productId }).lean();
}

export async function setVariants(productId, variants) {
  return Inventory.findOneAndUpdate(
    { productId },
    { productId, variants },
    { upsert: true, new: true }
  );
}

export async function decrementStock(items) {
  for (const item of items) {
    await Inventory.updateOne(
      { productId: item.productId, 'variants.size': item.size },
      { $inc: { 'variants.$.stock': -item.qty } }
    );
  }
}

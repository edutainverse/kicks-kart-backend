import Review from './review.model.js';

export async function getReviewsForProduct(req, res, next) {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).lean();
    res.json(reviews);
  } catch (e) { next(e); }
}

export async function addReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      productId: req.params.productId,
      userId: req.user.sub,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (e) { next(e); }
}

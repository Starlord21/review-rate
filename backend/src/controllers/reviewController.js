const Company = require("../models/Company");
const Review = require("../models/Review");

function reviewSort(sort) {
  if (sort === "rating") return { rating: -1, createdAt: -1 };
  if (sort === "date") return { createdAt: -1 };
  if (sort === "oldest") return { createdAt: 1 };
  if (sort === "relevance") return { likes: -1, rating: -1, createdAt: -1 };
  return { createdAt: -1 };
}

async function getReviews(req, res, next) {
  try {
    const { sort = "latest" } = req.query;
    const company = await Company.findById(req.params.companyId).select("_id").lean();
    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    const reviews = await Review.find({ company: req.params.companyId })
      .sort(reviewSort(sort))
      .lean();

    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      averageRating,
      reviewCount: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
}

async function createReview(req, res, next) {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    const review = await Review.create({
      company: company._id,
      fullName: req.body.fullName,
      subject: req.body.subject,
      reviewText: req.body.reviewText,
      rating: req.body.rating
    });

    res.status(201).json(review);
  } catch (error) {
    if (res.statusCode === 200) res.status(400);
    next(error);
  }
}

async function likeReview(req, res, next) {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getReviews,
  createReview,
  likeReview
};

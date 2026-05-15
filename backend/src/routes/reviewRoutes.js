const express = require("express");
const { likeReview } = require("../controllers/reviewController");

const router = express.Router();

router.patch("/:reviewId/like", likeReview);

module.exports = router;

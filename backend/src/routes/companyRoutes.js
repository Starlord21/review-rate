const express = require("express");
const {
  createCompany,
  getCompanies,
  getCompanyById,
  getCompanyCities
} = require("../controllers/companyController");
const { createReview, getReviews } = require("../controllers/reviewController");
const logoUpload = require("../middleware/logoUpload");

const router = express.Router();

router.route("/")
  .get(getCompanies)
  .post(logoUpload.single("logo"), createCompany);

router.get("/cities", getCompanyCities);

router.route("/:companyId/reviews")
  .get(getReviews)
  .post(createReview);

router.route("/:id")
  .get(getCompanyById);

module.exports = router;

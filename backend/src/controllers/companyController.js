const Company = require("../models/Company");
const Review = require("../models/Review");
const uploadCompanyLogo = require("../services/imagekitUpload");

function normalizeSort(sort) {
  return String(sort || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function companySortMode(sort) {
  const value = normalizeSort(sort);

  if (value === "oldest") return "oldest";
  if (value === "name") return "name";
  if (value.includes("rating")) return "rating";
  if (value.includes("founded") || value === "date") {
    return "founded";
  }

  return "latest";
}

function companySortStage(sort) {
  const mode = companySortMode(sort);

  if (mode === "oldest") return { createdAt: 1, name: 1 };
  if (mode === "name") return { name: 1 };
  if (mode === "rating") return { sortRating: -1, reviewCount: -1, name: 1 };
  if (mode === "founded") return { sortFoundedOn: -1, name: 1 };

  return { createdAt: -1, name: 1 };
}

async function getCompanies(req, res, next) {
  try {
    const { search = "", city = "", sort = "latest" } = req.query;
    const query = {};

    if (search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    if (city.trim()) {
      query.city = { $regex: city.trim(), $options: "i" };
    }

    const sortMode = companySortMode(sort);


    const needsReviews = sortMode === "rating";

    const pipeline = [
      { $match: query },
      ...(needsReviews
        ? [
            {
              $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "company",
                as: "reviews",
              },
            },
            {
              $addFields: {
               
                sortRating: {
                  $ifNull: [{ $avg: "$reviews.rating" }, 0],
                },
                reviewCount: { $size: "$reviews" },
                averageRating: {
                  $ifNull: [{ $avg: "$reviews.rating" }, 0],
                },
              },
            },
          ]
        : [
         
            {
              $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "company",
                as: "reviews",
              },
            },
            {
              $addFields: {
                averageRating: {
                  $ifNull: [{ $avg: "$reviews.rating" }, 0],
                },
                reviewCount: { $size: "$reviews" },
              },
            },
          ]),
    
      {
        $addFields: {
          sortFoundedOn: {
            $ifNull: ["$foundedOn", new Date(0)],
          },
        },
      },
      { $sort: companySortStage(sort) },
      {
        $project: {
          reviews: 0,
          sortRating: 0,
          sortFoundedOn: 0,
        },
      },
    ];

    const companies = await Company.aggregate(pipeline);
    res.json(companies);
  } catch (error) {
    next(error);
  }
}

async function createCompany(req, res, next) {
  try {
    const payload = { ...req.body };

    if (req.file) {
      const uploadedLogo = await uploadCompanyLogo(req.file);
      payload.logo = uploadedLogo.url;
    }

    const company = await Company.create(payload);
    res.status(201).json(company);
  } catch (error) {
    res.status(400);
    next(error);
  }
}

async function getCompanyById(req, res, next) {
  try {
    const company = await Company.findById(req.params.id).lean();
    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    const stats = await Review.aggregate([
      { $match: { company: company._id } },
      {
        $group: {
          _id: "$company",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    res.json({
      ...company,
      averageRating: stats[0]?.averageRating || 0,
      reviewCount: stats[0]?.reviewCount || 0,
    });
  } catch (error) {
    next(error);
  }
}

async function getCompanyCities(req, res, next) {
  try {
    const cities = await Company.distinct("city");
    res.json(cities.filter(Boolean).sort());
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCompanies,
  createCompany,
  getCompanyById,
  getCompanyCities,
};

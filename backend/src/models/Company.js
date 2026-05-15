const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 120
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: 160
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: 80
    },
    foundedOn: {
      type: Date,
      required: [true, "Founded date is required"]
    },
    logo: {
      type: String,
      trim: true,
      default: ""
    },
    description: {
      type: String,
      trim: true,
      maxlength: 900,
      default: ""
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

companySchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "company"
});

module.exports = mongoose.model("Company", companySchema);

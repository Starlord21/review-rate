const uploadCompanyLogo = require("../services/imagekitUpload");

async function uploadLogo(req, res, next) {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Logo image is required");
    }

    const uploadedFile = await uploadCompanyLogo(req.file);

    res.status(201).json({
      url: uploadedFile.url,
      fileId: uploadedFile.fileId,
      name: uploadedFile.name
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadLogo
};

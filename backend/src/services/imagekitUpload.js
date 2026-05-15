const { toFile } = require("@imagekit/nodejs");
const getImageKitClient = require("../config/imagekit");

function safeFileName(originalName) {
  const extension = originalName.includes(".")
    ? originalName.slice(originalName.lastIndexOf("."))
    : ".png";
  const base = originalName
    .replace(extension, "")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${base || "company-logo"}-${Date.now()}${extension}`;
}

async function uploadCompanyLogo(file) {
  const client = await getImageKitClient();
  const fileName = safeFileName(file.originalname);
  const uploadedFile = await client.files.upload({
    file: await toFile(file.buffer, fileName),
    fileName,
    folder: "/company-logos",
    useUniqueFileName: true
  });

  return {
    url: uploadedFile.url,
    fileId: uploadedFile.fileId,
    name: uploadedFile.name
  };
}

module.exports = uploadCompanyLogo;

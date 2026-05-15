let imageKitClient;

function assertImageKitEnv() {
  const required = ["IMAGEKIT_PRIVATE_KEY", "IMAGEKIT_URL_ENDPOINT"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing ImageKit configuration: ${missing.join(", ")}`);
  }
}

async function getImageKitClient() {
  assertImageKitEnv();

  if (!imageKitClient) {
    const imageKitModule = await import("@imagekit/nodejs");
    const ImageKit = imageKitModule.default;

    imageKitClient = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY
    });
  }

  return imageKitClient;
}

module.exports = getImageKitClient;

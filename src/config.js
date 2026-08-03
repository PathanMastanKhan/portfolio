/* ============================================================
   CONFIG — your photo hosting and admin passcode.
   Same values as your previous site, carried over.
   See README.md if you ever need to change any of these.
   ============================================================ */
export const CONFIG = {
  // Cloudinary — stores the actual image files online.
  CLOUDINARY_CLOUD_NAME: "xpgznkgi",
  CLOUDINARY_UPLOAD_PRESET: "efk7aqja",

  // JSONBin — stores the *list* of photo URLs so the gallery
  // is the same for every visitor, not just your own browser.
  JSONBIN_BIN_ID: "6a6f3ecbf5f4af5e29e10944",
  JSONBIN_API_KEY: "$2a$10$WDckFhZfNFyxkkssOLRXDeuVuNw/debYv6O.8TODv2uUwEwAP5J5O",

  // Admin passcode — visiting yoursite.com/?admin=THIS_VALUE once
  // unlocks the upload button on that browser. Normal visitors
  // never see it.
  ADMIN_PASSCODE: "uploadpicsNew",
};

export const isCloudinaryConfigured = () =>
  !CONFIG.CLOUDINARY_CLOUD_NAME.startsWith("YOUR_") &&
  !CONFIG.CLOUDINARY_UPLOAD_PRESET.startsWith("YOUR_");

export const hasSharedStore = () =>
  !CONFIG.JSONBIN_BIN_ID.startsWith("YOUR_") &&
  !CONFIG.JSONBIN_API_KEY.startsWith("YOUR_");

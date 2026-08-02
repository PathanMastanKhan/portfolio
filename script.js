/* ============================================================
   CONFIG — fill these in to make photo uploads go live.
   See README.md for the 2-minute setup for each service.
   ============================================================ */
const CONFIG = {
  // Cloudinary — stores the actual image files online.
  CLOUDINARY_CLOUD_NAME: "xpgznkgi",
  CLOUDINARY_UPLOAD_PRESET: "efk7aqja",

  // JSONBin — stores the *list* of photo URLs so the gallery
  // is the same for every visitor, not just your own browser.
  JSONBIN_BIN_ID: "YOUR_BIN_ID",
  JSONBIN_API_KEY: "YOUR_JSONBIN_X_ACCESS_KEY",

  // Admin passcode — change this to something private only you know.
  // Visiting yoursite.com/?admin=THIS_VALUE once unlocks the upload
  // button on that browser. Normal visitors never see it.
  ADMIN_PASSCODE: "pmk-set-your-own-passcode",
};

const isConfigured = () =>
  !CONFIG.CLOUDINARY_CLOUD_NAME.startsWith("YOUR_") &&
  !CONFIG.CLOUDINARY_UPLOAD_PRESET.startsWith("YOUR_");

const hasSharedStore = () =>
  !CONFIG.JSONBIN_BIN_ID.startsWith("YOUR_") &&
  !CONFIG.JSONBIN_API_KEY.startsWith("YOUR_");

const LOCAL_KEY = "pmk_gallery_local_fallback";
const ADMIN_KEY = "pmk_admin_unlocked";

/* ============================================================
   ADMIN MODE — upload UI is hidden from regular visitors.
   Visit yoursite.com/?admin=YOUR_PASSCODE once to unlock it on
   that browser; it stays unlocked until "Exit admin view" is
   clicked or site data/localStorage is cleared.
   ============================================================ */
function isAdmin() {
  return localStorage.getItem(ADMIN_KEY) === "true";
}

function checkAdminUnlock() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("admin");

  if (key && CONFIG.ADMIN_PASSCODE && key === CONFIG.ADMIN_PASSCODE) {
    localStorage.setItem(ADMIN_KEY, "true");
    // scrub the passcode out of the visible URL
    params.delete("admin");
    const query = params.toString();
    const cleanUrl =
      window.location.pathname + (query ? `?${query}` : "") + window.location.hash;
    window.history.replaceState({}, "", cleanUrl);
  }
}

function applyAdminVisibility() {
  document.getElementById("uploadBlock").style.display = isAdmin() ? "flex" : "none";
  document.getElementById("adminBanner").style.display = isAdmin() ? "block" : "none";
}

/* ============================================================
   GALLERY STATE
   ============================================================ */
let photos = []; // array of { url }

async function loadPhotos() {
  if (hasSharedStore()) {
    try {
      const res = await fetch(
        `https://api.jsonbin.io/v3/b/${CONFIG.JSONBIN_BIN_ID}/latest`,
        { headers: { "X-Access-Key": CONFIG.JSONBIN_API_KEY } }
      );
      const data = await res.json();
      photos = data?.record?.photos || [];
      return;
    } catch (e) {
      console.warn("JSONBin load failed, falling back to local storage.", e);
    }
  }
  // fallback: this browser only
  photos = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
}

async function savePhotos() {
  if (hasSharedStore()) {
    try {
      await fetch(`https://api.jsonbin.io/v3/b/${CONFIG.JSONBIN_BIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Access-Key": CONFIG.JSONBIN_API_KEY,
        },
        body: JSON.stringify({ photos }),
      });
      return;
    } catch (e) {
      console.warn("JSONBin save failed, saving locally instead.", e);
    }
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(photos));
}

/* ============================================================
   RENDER
   ============================================================ */
const MIN_FRAMES = 6;

function renderGallery() {
  const grid = document.getElementById("frameGrid");
  grid.innerHTML = "";

  photos.forEach((p, i) => {
    const frame = document.createElement("div");
    frame.className = "frame";
    frame.innerHTML = `
      <span class="frame-num">${String(i + 1).padStart(2, "0")}</span>
      <img src="${p.url}" alt="Portfolio photo ${i + 1}" loading="lazy">
    `;
    frame.addEventListener("click", () => openLightbox(p.url));
    grid.appendChild(frame);
  });

  if (isAdmin()) {
    const emptySlots = Math.max(0, MIN_FRAMES - photos.length);
    for (let i = 0; i < emptySlots; i++) {
      const frame = document.createElement("div");
      frame.className = "frame frame-empty";
      frame.textContent = "AWAITING\nUPLOAD";
      grid.appendChild(frame);
    }
  }
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(url) {
  document.getElementById("lightboxImg").src = url;
  document.getElementById("lightbox").classList.add("open");
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.getElementById("lightboxImg").src = "";
}
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

/* ============================================================
   NAV MARK — clicking P.M.K. refreshes the page
   ============================================================ */
document.getElementById("navMark").addEventListener("click", () => {
  window.location.reload();
});

/* ============================================================
   UPLOAD
   ============================================================ */
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const uploadBtnText = document.getElementById("uploadBtnText");
const uploadHint = document.getElementById("uploadHint");

uploadBtn.addEventListener("click", () => {
  if (!isConfigured()) {
    uploadHint.textContent =
      "Photo hosting isn't connected yet — add your Cloudinary details in script.js (see README.md).";
    return;
  }
  fileInput.click();
});

fileInput.addEventListener("change", async () => {
  const files = Array.from(fileInput.files || []);
  if (!files.length) return;

  uploadBtnText.textContent = "Uploading…";
  uploadBtn.disabled = true;

  let successCount = 0;
  for (const file of files) {
    try {
      const url = await uploadToCloudinary(file);
      photos.unshift({ url });
      successCount++;
    } catch (e) {
      console.error("Upload failed", e);
    }
  }

  if (successCount) {
    await savePhotos();
    renderGallery();
    uploadHint.textContent = `${successCount} photo(s) added to the online media library.`;
  } else {
    uploadHint.textContent = "Upload failed. Check your Cloudinary setup in script.js.";
  }

  uploadBtnText.textContent = "+ Upload New Photo(s)";
  uploadBtn.disabled = false;
  fileInput.value = "";
});

document.getElementById("adminExit").addEventListener("click", () => {
  localStorage.removeItem(ADMIN_KEY);
  applyAdminVisibility();
  renderGallery();
});

async function uploadToCloudinary(file) {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Cloudinary upload failed");
  const data = await res.json();
  return data.secure_url;
}

/* ============================================================
   INIT
   ============================================================ */
(async function init() {
  document.getElementById("year").textContent = new Date().getFullYear();

  checkAdminUnlock();
  applyAdminVisibility();

  if (!isAdmin()) {
    await loadPhotos();
    renderGallery();
    return;
  }

  if (!isConfigured()) {
    uploadHint.textContent =
      "Photo hosting isn't connected yet — add your Cloudinary details in script.js (see README.md).";
  } else if (!hasSharedStore()) {
    uploadHint.textContent =
      "Photos will upload online, but the gallery list is only saved on this browser until JSONBin is connected (see README.md).";
  }

  await loadPhotos();
  renderGallery();
})();

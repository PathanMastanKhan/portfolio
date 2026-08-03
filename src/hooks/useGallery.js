import { useEffect, useState } from "react";
import { CONFIG, hasSharedStore } from "../config";

const LOCAL_KEY = "pmk_gallery_local_fallback";

async function fetchPhotos() {
  if (hasSharedStore()) {
    try {
      const res = await fetch(
        `https://api.jsonbin.io/v3/b/${CONFIG.JSONBIN_BIN_ID}/latest`,
        { headers: { "X-Master-Key": CONFIG.JSONBIN_API_KEY } }
      );
      if (!res.ok) throw new Error(`JSONBin load returned ${res.status}`);
      const data = await res.json();
      return data?.record?.photos || [];
    } catch (e) {
      console.warn("JSONBin load failed, falling back to local storage.", e);
    }
  }
  return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
}

async function persistPhotos(photos) {
  if (hasSharedStore()) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${CONFIG.JSONBIN_BIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": CONFIG.JSONBIN_API_KEY,
        },
        body: JSON.stringify({ photos }),
      });
      if (!res.ok) throw new Error(`JSONBin save returned ${res.status}`);
      return { ok: true };
    } catch (e) {
      console.warn("JSONBin save failed, saving locally instead.", e);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(photos));
      return { ok: false, error: e.message || String(e) };
    }
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(photos));
  return { ok: true };
}

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

export function useGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      const loaded = await fetchPhotos();
      setPhotos(loaded);
      setLoading(false);
    })();
  }, []);

  async function uploadFiles(files) {
    let successCount = 0;
    const newUrls = [];

    for (const file of files) {
      try {
        const url = await uploadToCloudinary(file);
        newUrls.push({ url });
        successCount++;
      } catch (e) {
        console.error("Upload failed", e);
      }
    }

    if (successCount) {
      const updated = [...newUrls, ...photos];
      setPhotos(updated);
      const result = await persistPhotos(updated);
      if (result.ok) {
        setStatus(
          `${successCount} photo(s) added to the online media library and saved for all visitors.`
        );
      } else {
        setStatus(
          `${successCount} photo(s) uploaded, but the shared gallery save FAILED (${result.error}). Photos are only visible on this device right now — check your JSONBin key in src/config.js.`
        );
      }
    } else {
      setStatus("Upload failed. Check your Cloudinary setup in src/config.js.");
    }
  }

  async function deletePhoto(index) {
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    await persistPhotos(updated);
  }

  return { photos, loading, status, uploadFiles, deletePhoto };
}

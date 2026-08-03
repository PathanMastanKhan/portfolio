import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { useAdmin } from "../hooks/useAdmin";
import { useGallery } from "../hooks/useGallery";
import { isCloudinaryConfigured } from "../config";
import Lightbox from "./Lightbox";

const MIN_FRAMES = 6;

const GallerySection = () => {
  const { isAdmin } = useAdmin();
  const { photos, uploadFiles, deletePhoto, status } = useGallery();
  const [uploading, setUploading] = useState(false);
  const [localHint, setLocalHint] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (!isCloudinaryConfigured()) {
      setLocalHint(
        "Photo hosting isn't connected yet — add your Cloudinary details in src/config.js."
      );
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    await uploadFiles(files);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (index) => {
    if (!confirm("Delete this photo? This can't be undone.")) return;
    if (lightboxIndex !== null) setLightboxIndex(null);
    await deletePhoto(index);
  };

  const emptySlots = isAdmin ? Math.max(0, MIN_FRAMES - photos.length) : 0;
  const hintText = localHint || status;

  return (
    <>
      <motion.div variants={textVariant()} className="text-center">
        <p className={styles.sectionSubText}>Portfolio</p>
        <h2 className={styles.sectionHeadText}>Contact Sheet</h2>
        <p className="text-secondary max-w-[52ch] mx-auto mt-3">
          Headshots, full-body shots, and lookbook images. Click any frame to view full
          resolution.
        </p>
      </motion.div>

      <motion.div
        variants={fadeIn("up", "spring", 0.2, 0.8)}
        className="mt-10 bg-black-100 border border-line"
      >
        <div className="sprockets" aria-hidden="true" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[2px] bg-line p-[2px]">
          {photos.map((p, i) => (
            <div
              key={p.url + i}
              className="relative aspect-[4/5] bg-tertiary overflow-hidden cursor-pointer group"
              onClick={() => setLightboxIndex(i)}
            >
              <span className="absolute top-1.5 left-2 font-mono text-[10px] tracking-[0.08em] text-gold bg-primary/70 px-1.5 py-0.5 z-[1]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <img
                src={p.url}
                alt={`Portfolio photo ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(i);
                  }}
                  aria-label={`Delete photo ${i + 1}`}
                  title="Delete photo"
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-primary/80 border border-line text-white-100 text-[16px] leading-none flex items-center justify-center hover:bg-velvet hover:border-velvet transition-colors z-[1]"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {Array.from({ length: emptySlots }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-[4/5] bg-tertiary flex items-center justify-center text-center font-mono text-[11px] text-secondary p-4"
            >
              AWAITING
              <br />
              UPLOAD
            </div>
          ))}
        </div>
        <div className="sprockets" aria-hidden="true" />
      </motion.div>

      {isAdmin && (
        <div className="mt-9 flex flex-col items-start gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileChange}
          />
          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="font-mono text-[13px] uppercase tracking-[0.08em] border border-gold text-gold px-6 py-3 hover:bg-gold hover:text-primary transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "+ Upload New Photo(s)"}
          </button>

          {hintText && (
            <p className="font-mono text-[12px] text-secondary max-w-[52ch]">{hintText}</p>
          )}

          <div className="mt-2 p-5 bg-black-100 border border-line max-w-[52ch]">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold mb-2">
              How to upload
            </p>
            <ol className="list-decimal list-inside text-white-100 text-[14px] leading-[1.7] space-y-0.5">
              <li>
                Click <strong>"+ Upload New Photo(s)"</strong> above.
              </li>
              <li>Choose one or more image files from your device.</li>
              <li>Wait for the button to say "Uploading…" — this sends each photo to your online media library.</li>
              <li>Once it finishes, the new photo(s) appear instantly at the front of the gallery, numbered.</li>
              <li>They're now live for anyone visiting your public link.</li>
            </ol>
          </div>
        </div>
      )}

      <Lightbox
        photos={photos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={() => setLightboxIndex((i) => (i + 1) % photos.length)}
        onPrev={() => setLightboxIndex((i) => (i - 1 + photos.length) % photos.length)}
      />
    </>
  );
};

export default SectionWrapper(GallerySection, "gallery");

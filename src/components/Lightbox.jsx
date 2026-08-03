import { useEffect } from "react";

const Lightbox = ({ photos, index, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  if (index === null || !photos[index]) return null;

  const multiple = photos.length > 1;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-6 text-white-100 text-4xl leading-none bg-transparent border-none cursor-pointer"
      >
        ×
      </button>

      {multiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-tertiary/70 border border-line text-white-100 text-3xl flex items-center justify-center hover:bg-gold hover:text-primary hover:border-gold transition-colors"
        >
          ‹
        </button>
      )}

      <img
        src={photos[index].url}
        alt={`Portfolio photo ${index + 1}`}
        className="max-w-[90vw] max-h-[88vh] object-contain shadow-2xl"
      />

      {multiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-tertiary/70 border border-line text-white-100 text-3xl flex items-center justify-center hover:bg-gold hover:text-primary hover:border-gold transition-colors"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default Lightbox;

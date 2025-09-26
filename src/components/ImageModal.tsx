
import { X } from "lucide-react";
interface ImageModalProps {
  image: string | null;
  onClose: () => void;
}
export function ImageModal({ image, onClose }: ImageModalProps) {
  if (!image) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-6xl w-full">
        <img
          src={image}
          alt="Selected treatment"
          className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          style={{
            WebkitUserSelect: "none",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

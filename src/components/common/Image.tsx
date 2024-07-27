import { AdvancedImage, lazyload, placeholder, responsive } from "@cloudinary/react";
import { scale } from "@cloudinary/url-gen/actions/resize";

import { cld } from "@/cloudinary.ts";

interface ImageProps {
  path: string;
  className?: string;
  onClick?: () => void;
}

function Image({ path, className, onClick }: ImageProps) {
  const img = cld.image(`lsfm/assets/${path}`);
  img.resize(scale().width("auto"));

  return (
    <AdvancedImage
      cldImg={img}
      crossOrigin="anonymous"
      className={`rounded-lg ${className}`}
      plugins={[lazyload(), responsive(), placeholder({ mode: "blur" })]}
      onClick={onClick}
    />
  );
}

export default Image;

import { cld } from "@/cloudinary.ts";
import { cn } from "@/utils";
import { AdvancedVideo, lazyload, placeholder, responsive } from "@cloudinary/react";
import { scale } from "@cloudinary/url-gen/actions/resize";

interface VideoProps {
  path: string;
  className?: string;
  onClick?: () => void;
}

function Video({ path, className, onClick }: VideoProps) {
  const vid = cld.video(`lsfm/assets/${path}`);
  vid.resize(scale().width("auto"));

  return (
    <AdvancedVideo
      autoPlay
      playsInline
      muted
      loop
      cldVid={vid}
      className={cn("rounded-lg", className)}
      plugins={[lazyload(), responsive(), placeholder({ mode: "blur" })]}
      onClick={onClick}
      // @ts-ignore
      crossOrigin="anonymous"
    />
  );
}

export default Video;

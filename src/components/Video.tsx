import {
  AdvancedVideo,
  lazyload,
  placeholder,
  responsive,
} from "@cloudinary/react";
import { scale } from "@cloudinary/url-gen/actions/resize";

import { cld } from "../cloudinary.ts";

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
      className={`w-full rounded-lg ${className}`}
      plugins={[lazyload(), responsive(), placeholder({ mode: "blur" })]}
      onClick={onClick}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      crossOrigin="anonymous"
    />
  );
}

export default Video;

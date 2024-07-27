import { useMemo } from "react";

import { useParams } from "@tanstack/react-router";

import { useStore } from "@/store.ts";
import type { MediaType, Member } from "@/types/member.ts";

import Image from "../common/Image.tsx";
import Video from "../common/Video.tsx";

interface MiniGalleryProps {
  header: string;
  media: string[];
  type: MediaType;
}

function MiniGallery({ header, media, type }: MiniGalleryProps) {
  const { setSelectedVisual, setOutput } = useStore();
  const { member }: { member: Member } = useParams({ strict: false });

  const MediaComponent = useMemo(() => (type === "video" ? Video : Image), [type]);

  const handleClick = (medium: string) => () => {
    setSelectedVisual(medium);
    setOutput(medium);
  };

  return (
    <div className="mb-8">
      <h3 className="my-2 text-2xl">{header}</h3>
      <hr className="text-white" />
      <div className="cursor-grab overflow-x-scroll whitespace-nowrap py-4">
        {media.map(medium => (
          <MediaComponent
            key={medium}
            path={`${member}/${medium}`}
            onClick={handleClick(medium)}
            className="hover:-translate-y-1 h-[200px] cursor-pointer rounded-xl px-2 grayscale transition-all duration-300 ease-in-out"
          />
        ))}
      </div>
    </div>
  );
}

export default MiniGallery;

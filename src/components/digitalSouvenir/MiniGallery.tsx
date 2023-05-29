import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useDispatch } from "../../hooks/store.ts";
import { setOutput, setSelectedVisual } from "../../store/appSlice.ts";
import { MediaType, Member } from "../../types/member.ts";
import Image from "../common/Image.tsx";
import Video from "../common/Video.tsx";

interface MiniGalleryProps {
  header: string;
  media: string[];
  type: MediaType;
}

function MiniGallery({ header, media, type }: MiniGalleryProps) {
  const dispatch = useDispatch();
  const member = useParams().member as Member;

  const MediaComponent = useMemo(
    () => (type === "video" ? Video : Image),
    [type],
  );

  const handleClick = (medium: string) => () => {
    dispatch(setSelectedVisual(medium));
    dispatch(setOutput(medium));
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl my-2">{header}</h3>
      <hr className="text-white" />
      <div className="overflow-x-scroll whitespace-nowrap py-4 cursor-grab">
        {media.map(medium => (
          <MediaComponent
            key={medium}
            path={`${member}/${medium}`}
            onClick={handleClick(medium)}
            className="px-2 rounded-xl h-[200px] grayscale cursor-pointer transition-all ease-in-out duration-300 hover:-translate-y-1"
          />
        ))}
      </div>
    </div>
  );
}

export default MiniGallery;

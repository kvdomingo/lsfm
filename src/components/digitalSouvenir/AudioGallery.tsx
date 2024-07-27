import { useMemo } from "react";

import { audioText } from "@/constants.ts";
import { useStore } from "@/store.ts";
import { cn } from "@/utils";

function AudioGallery() {
  const { selectedAudio: selAudio, setSelectedAudio } = useStore();

  const audio = useMemo(
    () =>
      Array(7)
        .fill("")
        .map((_, i) => `auditory_${i}_${audioText[i]}.mp3`),
    [],
  );

  return (
    <div className="mb-6">
      <h3 className="my-2 text-2xl">AUDITORY</h3>
      <hr className="text-white" />
      <div className="grid grid-cols-7 gap-4 py-4">
        {audio.map((au, i) => (
          <div
            key={au}
            role="button"
            className={cn(
              "flex aspect-square cursor-pointer place-content-center place-items-center border-2 border-solid p-2 text-center shadow-none",
              {
                "border-blue-500": selAudio === au,
              },
            )}
            onClick={() => setSelectedAudio(au)}
            onKeyDown={() => setSelectedAudio(au)}
          >
            <p>{audioText[i].toUpperCase().replace(/_/g, " ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AudioGallery;

import { useMemo } from "react";

import { audioText } from "@/constants.ts";
import { useDispatch, useSelector } from "@/hooks/store.ts";
import { setSelectedAudio } from "@/store/appSlice.ts";
import { cn } from "@/utils";

function AudioGallery() {
  const dispatch = useDispatch();
  const selAudio = useSelector(state => state.app.selectedAudio);

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
            className={cn(
              "flex aspect-square cursor-pointer place-content-center place-items-center border-2 border-solid p-2 text-center shadow-none",
              {
                "border-blue-500": selAudio === au,
              },
            )}
            onClick={() => dispatch(setSelectedAudio(au))}
          >
            <p>{audioText[i].toUpperCase().replace(/_/g, " ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AudioGallery;

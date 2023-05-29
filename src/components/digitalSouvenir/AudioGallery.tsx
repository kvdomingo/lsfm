import { useMemo } from "react";

import clsx from "clsx";

import { audioText } from "../../constants.ts";
import { useDispatch, useSelector } from "../../hooks/store.ts";
import { setSelectedAudio } from "../../store/appSlice.ts";

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
      <h3 className="text-2xl my-2">AUDITORY</h3>
      <hr className="text-white" />
      <div className="grid grid-cols-7 py-4 gap-4">
        {audio.map((au, i) => (
          <div
            className={clsx(
              "aspect-square shadow-none p-2 border-2 border-solid cursor-pointer text-center flex place-items-center place-content-center",
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

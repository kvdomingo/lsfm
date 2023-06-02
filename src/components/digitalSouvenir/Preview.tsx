import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

import {
  PauseCircleOutline as PauseCircleOutlineIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "@/hooks/store.ts";
import { setIsAudioPlaying, toggleIsAudioPlaying } from "@/store/appSlice.ts";
import { Member } from "@/types/member.ts";

import Image from "../common/Image.tsx";
import Video from "../common/Video.tsx";

const GS_URL = import.meta.env.VITE_GS_URL;

function Preview() {
  const dispatch = useDispatch();
  const member = useParams().member as Member;
  const selVisual = useSelector(state => state.app.selectedVisual);
  const selText = useSelector(state => state.app.selectedText);
  const selAudio = useSelector(state => state.app.selectedAudio);
  const output = useSelector(state => state.app.output);
  const isAudioPlaying = useSelector(state => state.app.isAudioPlaying);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const ref = audioRef.current;
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", () =>
        dispatch(setIsAudioPlaying(false)),
      );
      audioRef.current.addEventListener("playing", () =>
        dispatch(setIsAudioPlaying(true)),
      );
      audioRef.current.addEventListener("pause", () =>
        dispatch(setIsAudioPlaying(false)),
      );
    }
    return () => {
      if (ref) {
        ref.removeEventListener("ended", () =>
          dispatch(setIsAudioPlaying(false)),
        );
        ref.removeEventListener("playing", () =>
          dispatch(setIsAudioPlaying(true)),
        );
        ref.removeEventListener("pause", () =>
          dispatch(setIsAudioPlaying(false)),
        );
      }
    };
  }, [dispatch]);

  const MediaComponent = useMemo(
    () => (output?.includes("Moving") ? Video : Image),
    [output],
  );

  const handleClick = () => {
    if (isAudioPlaying) audioRef.current?.pause();
    else void audioRef.current?.play();
    dispatch(toggleIsAudioPlaying());
  };

  return (
    <div className="relative z-0">
      {!selVisual ? null : (
        <MediaComponent path={`${member}/${selVisual}`} className="w-full" />
      )}
      {!!selText && (
        <Image
          path={`${member}/${selText}`}
          className="absolute left-0 top-0 w-full"
        />
      )}
      {!!selAudio && !!audioRef.current && (
        <div className="absolute bottom-0 left-0">
          <button
            onClick={handleClick}
            className="cursor-pointer border-none bg-transparent text-white opacity-75"
          >
            {isAudioPlaying ? (
              <PauseCircleOutlineIcon sx={{ fontSize: 100 }} />
            ) : (
              <PlayCircleOutlineIcon sx={{ fontSize: 100 }} />
            )}
          </button>
        </div>
      )}
      <audio
        preload="true"
        crossOrigin="anonymous"
        src={`${GS_URL}/${member}/${selAudio}`}
        ref={audioRef}
      />
    </div>
  );
}

export default Preview;

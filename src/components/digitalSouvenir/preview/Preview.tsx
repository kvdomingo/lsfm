import { useEffect, useRef } from "react";

import { useParams } from "@tanstack/react-router";
import {
  PauseCircle as PauseCircleOutlineIcon,
  PlayCircle as PlayCircleOutlineIcon,
} from "lucide-react";

import MemoMediaComponent from "@/components/digitalSouvenir/preview/MemoMediaComponent.tsx";
import MemoText from "@/components/digitalSouvenir/preview/MemoText.tsx";
import { useStore } from "@/store.ts";
import type { Member } from "@/types/member.ts";

const GS_URL = import.meta.env.VITE_GS_URL;

function Preview() {
  const {
    selectedVisual: selVisual,
    selectedText: selText,
    selectedAudio: selAudio,
    output,
    isAudioPlaying,
    setIsAudioPlaying,
    toggleIsAudioPlaying,
  } = useStore();
  const { member }: { member: Member } = useParams({ strict: false });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const ref = audioRef.current;
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", () => setIsAudioPlaying(false));
      audioRef.current.addEventListener("playing", () => setIsAudioPlaying(true));
      audioRef.current.addEventListener("pause", () => setIsAudioPlaying(false));
    }
    return () => {
      if (ref) {
        ref.removeEventListener("ended", () => setIsAudioPlaying(false));
        ref.removeEventListener("playing", () => setIsAudioPlaying(true));
        ref.removeEventListener("pause", () => setIsAudioPlaying(false));
      }
    };
  }, [setIsAudioPlaying]);

  const handleClick = () => {
    if (isAudioPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    toggleIsAudioPlaying();
  };

  return (
    <div className="relative z-0">
      <MemoMediaComponent output={output} member={member} selVisual={selVisual} />
      <MemoText selText={selText} member={member} />
      {!!selAudio && !!audioRef.current && (
        <div className="absolute bottom-0 left-0">
          <button
            onClick={handleClick}
            className="cursor-pointer border-none bg-transparent text-white opacity-75"
            type="button"
          >
            {isAudioPlaying ? (
              <PauseCircleOutlineIcon size={100} />
            ) : (
              <PlayCircleOutlineIcon size={100} />
            )}
          </button>
        </div>
      )}
      {/* biome-ignore lint/a11y/useMediaCaption: */}
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

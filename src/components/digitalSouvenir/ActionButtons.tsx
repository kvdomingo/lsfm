import ReactGA from "react-ga4";
import { useParams } from "react-router-dom";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { saveAs } from "file-saver";

import { buildUrl } from "@/cloudinary.ts";
import Button from "@/components/common/Button.tsx";
import { useDispatch, useSelector } from "@/hooks/store.ts";
import {
  Page,
  decreasePage,
  increasePage,
  setIsErrorNotificationOpen,
  setIsProcessing,
  setIsProcessingNotificationOpen,
} from "@/store/appSlice.ts";
import { Member } from "@/types/member.ts";

const GS_URL = import.meta.env.VITE_GS_URL;

const NODE_ENV = import.meta.env.NODE_ENV ?? "production";

const ffmpeg = createFFmpeg({
  log: NODE_ENV === "production",
  corePath: "/ffmpeg-core/ffmpeg-core.js",
});

function ActionButtons() {
  const member = useParams().member as Member;
  const dispatch = useDispatch();
  const page = useSelector(state => state.app.page);
  const selVisual = useSelector(state => state.app.selectedVisual);
  const selText = useSelector(state => state.app.selectedText);
  const selAudio = useSelector(state => state.app.selectedAudio);
  const isProcessing = useSelector(state => state.app.isProcessing);

  async function handleDownload() {
    if (!selVisual || !selText || !selAudio) return;

    dispatch(setIsProcessing(true));
    dispatch(setIsProcessingNotificationOpen(true));
    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    let data;
    ffmpeg.FS(
      "writeFile",
      selVisual,
      await fetchFile(buildUrl(`${member}/${selVisual}`)),
    );
    ffmpeg.FS(
      "writeFile",
      selText,
      await fetchFile(buildUrl(`${member}/${selText}`)),
    );
    ffmpeg.FS(
      "writeFile",
      selAudio,
      await fetchFile(`${GS_URL}/${member}/${selAudio}`),
    );

    const loopMethod = selVisual.includes("Moving")
      ? ["-stream_loop", "-1"]
      : ["-loop", "1"];
    const stillTune = selVisual.includes("Moving")
      ? []
      : ["-tune", "stillimage"];

    try {
      await ffmpeg.run(
        ...loopMethod,
        "-i",
        selVisual,
        "-i",
        selText,
        "-i",
        selAudio,
        "-filter_complex",
        "[0][1] overlay=0:0",
        "-c:v",
        "libx264",
        ...stillTune,
        "-c:a",
        "copy",
        "-map",
        "2:a",
        "-shortest",
        "out.mp4",
      );

      data = ffmpeg.FS("readFile", "out.mp4");

      ReactGA.event({
        category: "souvenir",
        action: "download",
        label: `${member} ${selVisual} ${selText} ${selAudio}`,
        value: 1,
      });

      dispatch(setIsProcessing(false));

      saveAs(
        URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" })),
        `${member}-digital-souvenir.mp4`,
      );
    } catch (err) {
      console.error(err);

      dispatch(setIsProcessing(false));
      dispatch(setIsErrorNotificationOpen(true));

      ReactGA.event({
        category: "souvenir",
        action: "download",
        label: `${member} ${selVisual} ${selText} ${selAudio}`,
        value: 0,
      });
    } finally {
      dispatch(setIsProcessingNotificationOpen(false));
    }
  }

  return (
    <div>
      {page > Page.VISUAL && (
        <Button onClick={() => dispatch(decreasePage())}>Back</Button>
      )}
      {!!selVisual && page === Page.VISUAL && (
        <Button onClick={() => dispatch(increasePage())}>
          <b>Next</b>
        </Button>
      )}
      {!!selText && !!selAudio && page === Page.TEXT_AUDIO && (
        <Button onClick={handleDownload} disabled={isProcessing}>
          Download
        </Button>
      )}
    </div>
  );
}

export default ActionButtons;

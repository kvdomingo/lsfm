import ReactGA from "react-ga4";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useParams } from "@tanstack/react-router";
import { saveAs } from "file-saver";

import { buildUrl } from "@/cloudinary.ts";
import Button from "@/components/common/Button.tsx";
import { Page, useZStore } from "@/store.ts";
import { Member } from "@/types/member.ts";

const GS_URL = import.meta.env.VITE_GS_URL;

const NODE_ENV = import.meta.env.NODE_ENV ?? "production";

const ffmpeg = createFFmpeg({
  log: NODE_ENV === "production",
  corePath: "/ffmpeg-core/ffmpeg-core.js",
});

function ActionButtons() {
  const {
    page,
    selectedVisual: selVisual,
    selectedText: selText,
    selectedAudio: selAudio,
    isProcessing,
    setIsProcessing,
    setIsProcessingNotificationOpen,
    setIsErrorNotificationOpen,
    increasePage,
    decreasePage,
  } = useZStore();
  const { member }: { member: Member } = useParams({ strict: false });

  async function handleDownload() {
    if (!selVisual || !selText || !selAudio) return;

    setIsProcessing(true);
    setIsProcessingNotificationOpen(true);
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

      setIsProcessing(false);

      saveAs(
        URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" })),
        `${member}-digital-souvenir.mp4`,
      );
    } catch (err) {
      console.error(err);

      setIsProcessing(false);
      setIsErrorNotificationOpen(true);

      ReactGA.event({
        category: "souvenir",
        action: "download",
        label: `${member} ${selVisual} ${selText} ${selAudio}`,
        value: 0,
      });
    } finally {
      setIsProcessingNotificationOpen(false);
    }
  }

  return (
    <div>
      {page > Page.VISUAL && (
        <Button onClick={() => decreasePage()}>Back</Button>
      )}
      {!!selVisual && page === Page.VISUAL && (
        <Button onClick={() => increasePage()}>
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

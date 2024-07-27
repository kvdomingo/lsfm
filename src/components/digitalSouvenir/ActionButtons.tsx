import { buildUrl } from "@/cloudinary.ts";
import Button from "@/components/common/Button.tsx";
import { Page, useStore } from "@/store.ts";
import type { Member } from "@/types/member.ts";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useParams } from "@tanstack/react-router";
import { saveAs } from "file-saver";
import { toast } from "sonner";

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
    increasePage,
    decreasePage,
  } = useStore();
  const { member }: { member: Member } = useParams({ strict: false });

  async function handleDownload() {
    if (!selVisual || !selText || !selAudio) return;

    setIsProcessing(true);
    const processingToastId = toast.loading("Processing media. Please wait...", {
      duration: Number.POSITIVE_INFINITY,
    });
    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    let data: Uint8Array;
    ffmpeg.FS(
      "writeFile",
      selVisual,
      await fetchFile(buildUrl(`${member}/${selVisual}`)),
    );
    ffmpeg.FS("writeFile", selText, await fetchFile(buildUrl(`${member}/${selText}`)));
    ffmpeg.FS(
      "writeFile",
      selAudio,
      await fetchFile(`${GS_URL}/${member}/${selAudio}`),
    );

    const loopMethod = selVisual.includes("Moving")
      ? ["-stream_loop", "-1"]
      : ["-loop", "1"];
    const stillTune = selVisual.includes("Moving") ? [] : ["-tune", "stillimage"];

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

      if (processingToastId != null) toast.dismiss(processingToastId);

      saveAs(
        URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" })),
        `${member}-digital-souvenir.mp4`,
      );
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      if (processingToastId != null) toast.dismiss(processingToastId);
      toast.error("An error occurred. Please try again later.", { duration: 5000 });
    } finally {
      if (processingToastId != null) toast.dismiss(processingToastId);
    }
  }

  return (
    <div>
      {page > Page.VISUAL && <Button onClick={() => decreasePage()}>Back</Button>}
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

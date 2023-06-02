import ReactGA from "react-ga4";
import { useParams } from "react-router-dom";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { saveAs } from "file-saver";

import Button from "@/components/common/Button.tsx";
import { useDispatch, useSelector } from "@/hooks/store.ts";
import {
  Page,
  decreasePage,
  increasePage,
  setIsProcessing,
  setNotification,
} from "@/store/appSlice.ts";
import { Member } from "@/types/member.ts";

const GS_URL = import.meta.env.VITE_GS_URL;

const ffmpeg = createFFmpeg({
  log: true,
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
    dispatch(
      setNotification({
        status: "info",
        message: "Processing media. Please wait...",
        isOpen: true,
      }),
    );
    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    let data;
    ffmpeg.FS(
      "writeFile",
      selVisual,
      await fetchFile(`${GS_URL}/${member}/${selVisual}`),
    );
    ffmpeg.FS(
      "writeFile",
      selText,
      await fetchFile(`${GS_URL}/${member}/${selText}`),
    );
    ffmpeg.FS(
      "writeFile",
      selAudio,
      await fetchFile(`${GS_URL}/${member}/${selAudio}`),
    );

    try {
      await ffmpeg.run(
        ...(selVisual.includes("Moving")
          ? ["-stream_loop", "-1"]
          : ["-loop", "1"]),
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
        ...(selVisual.includes("Moving") ? [] : ["-tune", "stillimage"]),
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

      dispatch(
        setNotification({
          isOpen: false,
          message: "",
          status: "info",
        }),
      );
      dispatch(setIsProcessing(false));

      saveAs(
        URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" })),
        `${member}-digital-souvenir.mp4`,
      );
    } catch (err) {
      console.error(err);

      dispatch(setIsProcessing(false));
      dispatch(
        setNotification({
          isOpen: true,
          status: "error",
          message: "An error occurred. Please try again later.",
        }),
      );
      setTimeout(
        () =>
          dispatch(
            setNotification({
              isOpen: false,
              status: "info",
              message: "",
            }),
          ),
        5000,
      );

      ReactGA.event({
        category: "souvenir",
        action: "download",
        label: `${member} ${selVisual} ${selText} ${selAudio}`,
        value: 0,
      });
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

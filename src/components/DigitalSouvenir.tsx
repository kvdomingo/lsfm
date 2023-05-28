import { useEffect, useMemo, useRef, useState } from "react";
import ReactGA from "react-ga4";
import { useParams } from "react-router-dom";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import {
  PauseCircleOutline as PauseCircleOutlineIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import { saveAs } from "file-saver";

import Image from "./Image.tsx";
import Video from "./Video.tsx";

const GS_URL = import.meta.env.VITE_GS_URL;

const memberIndex = {
  sakura: 1,
  garam: 2,
  eunchae: 3,
  chaewon: 4,
  kazuha: 5,
  yunjin: 6,
};

const audioText = [
  "intro",
  "killing_part",
  "message_kr_1",
  "message_kr_2",
  "message_kr_3",
  "message_jp",
  "message_en",
];

const ffmpeg = createFFmpeg({
  log: true,
  corePath: "/ffmpeg-core/ffmpeg-core.js",
});

function DigitalSouvenir() {
  const member = useParams().member! as keyof typeof memberIndex;
  const [page, setPage] = useState(1);
  const [openProgressNotification, setOpenProgressNotification] =
    useState(false);
  const [openErrorNotification, setOpenErrorNotification] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [selVisual, setSelVisual] = useState<string | null>(null);
  const [selText, setSelText] = useState<string | null>(null);
  const [selAudio, setSelAudio] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const visual = useMemo(
    () =>
      Array(10)
        .fill("")
        .map((_, i) => `Photocard_Visual_${memberIndex[member]}_${i + 1}.png`),
    [member],
  );

  const moving = useMemo(
    () =>
      Array(10)
        .fill("")
        .map(
          (_, i) => `Photocard_Visual_Moving_${memberIndex[member]}_${i + 1}`,
        ),
    [member],
  );

  const textWhite = useMemo(
    () =>
      Array(6)
        .fill("")
        .map((_, i) => `Photocard_Text_${memberIndex[member]}_${i + 1}_w.png`),
    [member],
  );

  const textBlack = useMemo(
    () =>
      Array(6)
        .fill("")
        .map((_, i) => `Photocard_Text_${memberIndex[member]}_${i + 1}_b.png`),
    [member],
  );

  const audio = useMemo(
    () =>
      Array(7)
        .fill("")
        .map((_, i) => `auditory_${i}_${audioText[i]}.mp3`),
    [],
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", () => setAudioPlaying(false));
      audioRef.current.addEventListener("playing", () => setAudioPlaying(true));
      audioRef.current.addEventListener("pause", () => setAudioPlaying(false));
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", () =>
          setAudioPlaying(false),
        );
        audioRef.current.removeEventListener("playing", () =>
          setAudioPlaying(true),
        );
        audioRef.current.removeEventListener("pause", () =>
          setAudioPlaying(false),
        );
      }
    };
  }, []);

  function handleSelectVisual(visual: string) {
    setSelVisual(visual);
    setSelText(null);
    setSelAudio(null);
    setAudioPlaying(false);
    setOutput(visual);
    audioRef.current = null;
  }

  async function handleAddText(text: string) {
    setSelText(text);
  }

  async function handleAddAudio(audio: string) {
    if (audioRef.current) audioRef.current.pause();
    setSelAudio(audio);
    setAudioPlaying(false);
  }

  async function handleDownload() {
    if (!selVisual || !selText || !selAudio) return;

    setLoading(true);
    setOpenProgressNotification(true);
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

      setOpenProgressNotification(false);
      setLoading(false);

      saveAs(
        URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" })),
        `${member}-digital-souvenir.mp4`,
      );
    } catch (err) {
      console.error(err);

      setLoading(false);
      setOpenProgressNotification(false);
      setOpenErrorNotification(true);

      ReactGA.event({
        category: "souvenir",
        action: "download",
        label: `${member} ${selVisual} ${selText} ${selAudio}`,
        value: 0,
      });
    }
  }

  return (
    <>
      <Container className="min-h-screen my-8" maxWidth="xl">
        <Grid container>
          <Grid item md={4} />
          <Grid item md>
            <div className="-mx-14 -mb-12">
              <h1 className="my-0">The First Moment of</h1>
              <h2 className="text-[100pt] relative my-0 capitalize text-outline">
                {member}
              </h2>
            </div>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={4}>
            <div className="relative">
              {!selVisual ? null : output?.includes("Moving") ? (
                <Video path={`${member}/${selVisual}`} />
              ) : (
                <Image path={`${member}/${selVisual}`} className="w-full" />
              )}
              {!!selText && (
                <Image
                  path={`${member}/${selText}`}
                  className="absolute top-0 left-0 w-full"
                />
              )}
              {!!selAudio && !!audioRef.current && (
                <div className="absolute bottom-0 left-0">
                  <IconButton
                    color="default"
                    onClick={() => {
                      if (audioPlaying) audioRef.current?.pause();
                      else void audioRef.current?.play();
                      setAudioPlaying(playing => !playing);
                    }}
                  >
                    {audioPlaying ? (
                      <PauseCircleOutlineIcon sx={{ fontSize: 100 }} />
                    ) : (
                      <PlayCircleOutlineIcon sx={{ fontSize: 100 }} />
                    )}
                  </IconButton>
                </div>
              )}
            </div>
          </Grid>
          <Grid item container md={8} className="content-start px-2 pt-12">
            {page === 1 && (
              <>
                <Container maxWidth="xl" className="mb-3">
                  <p className="uppercase text-sm font-bold">
                    Step 02. Choose the visual card you like best
                  </p>
                </Container>
                <Container maxWidth="xl">
                  <Typography variant="h5">Visual - Still Images</Typography>
                </Container>
                <Container maxWidth="xl" sx={{ py: 1 }}>
                  <Divider className="bg-white" />
                </Container>
                <Grid container>
                  {visual.map(vis => (
                    <Grid item md key={vis} sx={{ p: 1 }}>
                      <Image
                        path={`${member}/${vis}`}
                        onClick={() => handleSelectVisual(vis)}
                        className="w-full grayscale cursor-pointer transition-all ease-in-out duration-300 hover:-translate-y-0.5"
                      />
                    </Grid>
                  ))}
                </Grid>
                <Grid container className="mt-8">
                  <Container maxWidth="xl">
                    <Typography variant="h5">Visual - Moving Images</Typography>
                  </Container>
                  <Container maxWidth="xl" sx={{ py: 1 }}>
                    <Divider className="bg-white" />
                  </Container>
                  <Grid container>
                    {moving.map(mov => (
                      <Grid item md key={mov} sx={{ p: 1 }}>
                        <Video
                          path={`${member}/${mov}`}
                          className="cursor-pointer grayscale"
                          onClick={() => handleSelectVisual(mov)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </>
            )}
            {page === 2 && (
              <>
                <Container maxWidth="xl" className="mb-4">
                  <p className="text-sm uppercase font-bold">
                    Step 03. Choose one text card and one auditory card to
                    complete
                  </p>
                </Container>
                <Container maxWidth="xl">
                  <Typography variant="h5">TEXT</Typography>
                </Container>
                <Container maxWidth="xl" className="py-2">
                  <Divider className="bg-white" />
                </Container>
                <div className="mb-6">
                  <Grid container>
                    {textWhite.map(txt => (
                      <Grid item md key={txt} className="p-2">
                        <Image
                          path={`${member}/${txt}`}
                          className="w-full bg-[#080808] cursor-pointer border border-solid border-white"
                          onClick={async () => await handleAddText(txt)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Grid container>
                    {textBlack.map(txt => (
                      <Grid item md key={txt} className="p-2">
                        <Image
                          path={`${member}/${txt}`}
                          className="w-full cursor-pointer bg-white"
                          onClick={async () => await handleAddText(txt)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
                <Container maxWidth="xl">
                  <Typography variant="h5">AUDITORY</Typography>
                </Container>
                <Container maxWidth="xl" className="py-2">
                  <Divider className="bg-white" />
                </Container>
                <Grid container>
                  {audio.map((au, i) => (
                    <Grid item md key={au}>
                      <div
                        className={clsx(
                          "shadow-none m-2 p-2 border-2 border-solid cursor-pointer h-full text-center flex place-items-center place-content-center",
                          {
                            "border-blue-500": selAudio === au,
                          },
                        )}
                        onClick={async () => await handleAddAudio(au)}
                      >
                        <p>{audioText[i].toUpperCase().replace(/_/g, " ")}</p>
                        <audio
                          preload="true"
                          crossOrigin="anonymous"
                          src={`${GS_URL}/${member}/${au}`}
                          ref={selAudio === au ? audioRef : null}
                        />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
            <Grid container justifyContent="center" sx={{ mt: 4 }} spacing={2}>
              {page > 1 && (
                <Grid item md>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setPage(page => page - 1)}
                    fullWidth
                  >
                    Back
                  </Button>
                </Grid>
              )}
              {!!selVisual && page === 1 && (
                <Grid item md>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setPage(page => page + 1)}
                    fullWidth
                  >
                    Next
                  </Button>
                </Grid>
              )}
              {!!selText && !!selAudio && page === 2 && (
                <Grid item md>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownload}
                    fullWidth
                    disabled={loading}
                    sx={{ height: "100%" }}
                  >
                    Download
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={openProgressNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="info" icon={false}>
          <Grid container alignContent="center">
            <CircularProgress sx={{ mr: 1 }} size="1.5em" disableShrink />
            Processing media. Please wait...
          </Grid>
        </Alert>
      </Snackbar>
      <Snackbar
        open={openErrorNotification}
        autoHideDuration={5000}
        onClose={() => setOpenErrorNotification(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenErrorNotification(false)} severity="error">
          An error occurred. Please try again later.
        </Alert>
      </Snackbar>
    </>
  );
}

export default DigitalSouvenir;

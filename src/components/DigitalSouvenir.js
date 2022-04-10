import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  PlayCircleOutline as PlayCircleOutlineIcon,
  PauseCircleOutline as PauseCircleOutlineIcon,
} from "@mui/icons-material";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { saveAs } from "file-saver";

const { PUBLIC_URL } = process.env;

const GS_URL = process.env.REACT_APP_GS_URL;

const memberIndex = {
  sakura: 1,
  garam: 2,
  eunchae: 3,
  chaewon: 4,
  kazuha: 5,
  yunjin: 6,
};

const audioText = ["intro", "killing_part", "message_kr_1", "message_kr_2", "message_kr_3", "message_jp", "message_en"];

function DigitalSouvenir() {
  const { member } = useParams();
  const [page, setPage] = useState(1);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [selVisual, setSelVisual] = useState(null);
  const [selText, setSelText] = useState(null);
  const [selAudio, setSelAudio] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);
  const ffmpeg = createFFmpeg({ log: true, corePath: `${PUBLIC_URL}/ffmpeg-core/ffmpeg-core.js` });

  const visual = Array(10)
    .fill("")
    .map((_, i) => `Photocard_Visual_${memberIndex[member]}_${i + 1}.png`);

  const moving = Array(10)
    .fill("")
    .map((_, i) => `Photocard_Visual_Moving_${memberIndex[member]}_${i + 1}.mp4`);

  const textWhite = Array(6)
    .fill("")
    .map((_, i) => `Photocard_Text_${memberIndex[member]}_${i + 1}_w.png`);

  const textBlack = Array(6)
    .fill("")
    .map((_, i) => `Photocard_Text_${memberIndex[member]}_${i + 1}_b.png`);

  const audio = Array(7)
    .fill("")
    .map((_, i) => `auditory_${i}_${audioText[i]}.mp3`);

  useEffect(() => {
    if (!!audioRef.current) {
      audioRef.current.addEventListener("ended", () => setAudioPlaying(false));
      audioRef.current.addEventListener("playing", () => setAudioPlaying(true));
      audioRef.current.addEventListener("pause", () => setAudioPlaying(false));
    }
    return () => {
      if (!!audioRef.current) {
        audioRef.current.removeEventListener("ended", () => setAudioPlaying(false));
        audioRef.current.removeEventListener("playing", () => setAudioPlaying(true));
        audioRef.current.removeEventListener("pause", () => setAudioPlaying(false));
      }
    };
  }, [audioRef.current]);

  function handleSelectVisual(visual) {
    setSelVisual(visual);
    setSelText(null);
    setSelAudio(null);
    setAudioPlaying(false);
    setOutput(visual);
    audioRef.current = null;
  }

  async function handleAddText(text) {
    setSelText(text);
  }

  async function handleAddAudio(audio) {
    if (!!audioRef.current) audioRef.current.pause();
    setSelAudio(audio);
    setAudioPlaying(false);
  }

  async function handleDownload() {
    setLoading(true);
    await ffmpeg.load();
    ffmpeg.FS("writeFile", selVisual, await fetchFile(`${GS_URL}/${member}/${selVisual}`));
    ffmpeg.FS("writeFile", selText, await fetchFile(`${GS_URL}/${member}/${selText}`));
    ffmpeg.FS("writeFile", selAudio, await fetchFile(`${GS_URL}/${member}/${selAudio}`));
    await ffmpeg.run(
      ...(selVisual.endsWith("mp4") ? ["-stream_loop", "-1"] : ["-loop", "1"]),
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
      ...(selVisual.endsWith("mp4") ? [] : ["-tune", "stillimage"]),
      "-c:a",
      "copy",
      "-map",
      "2:a",
      "-shortest",
      "out.mp4",
    );
    const data = ffmpeg.FS("readFile", "out.mp4");
    setLoading(false);
    saveAs(URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" })), `${member}-digital-souvenir.mp4`);
  }

  return (
    <Container sx={{ minHeight: "100vh", mt: 6, py: "2em" }} maxWidth="xl">
      <Grid container>
        <Grid item md={4}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "max-content",
            }}
          >
            {!selVisual ? null : output.endsWith("mp4") ? (
              <video
                autoPlay
                loop
                playsInline
                muted
                style={{ width: "100%", borderRadius: 6 }}
                src={`${GS_URL}/${member}/${selVisual}`}
                crossOrigin="anonymous"
              />
            ) : (
              <img
                src={`${GS_URL}/${member}/${selVisual}`}
                style={{ width: "100%", borderRadius: 6 }}
                alt={`${member} ${output}`}
                crossOrigin="anonymous"
              />
            )}
            {!!selText && (
              <img
                src={`${GS_URL}/${member}/${selText}`}
                alt={`${member} ${selText}`}
                crossOrigin="anonymous"
                style={{
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            )}
            {!!selAudio && !!audioRef && (
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                }}
                color="default"
                onClick={() => {
                  if (audioPlaying) audioRef.current.pause();
                  else audioRef.current.play();
                  setAudioPlaying(playing => !playing);
                }}
              >
                {audioPlaying ? (
                  <PauseCircleOutlineIcon sx={{ fontSize: 100 }} />
                ) : (
                  <PlayCircleOutlineIcon sx={{ fontSize: 100 }} />
                )}
              </IconButton>
            )}
          </div>
        </Grid>
        <Grid item container md={8} alignContent="flex-start" px={2}>
          {page === 1 && (
            <>
              <Container maxWidth="xl" sx={{ mb: 3 }}>
                <Typography variant="overline">Step 02. Choose the visual card you like best</Typography>
              </Container>
              <Container maxWidth="xl">
                <Typography variant="h5">Visual - Still Images</Typography>
              </Container>
              <Container maxWidth="xl" sx={{ py: 1 }}>
                <Divider />
              </Container>
              <Grid container>
                {visual.map(vis => (
                  <Grid item md key={vis} sx={{ p: 1 }}>
                    <img
                      src={`${GS_URL}/${member}/${vis}`}
                      alt={`${member} ${vis}`}
                      style={{ width: "100%", borderRadius: 6, cursor: "pointer", filter: "grayscale(100%)" }}
                      onClick={() => handleSelectVisual(vis)}
                      crossOrigin="anonymous"
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid container sx={{ mt: 4 }}>
                <Container maxWidth="xl">
                  <Typography variant="h5">Visual - Moving Images</Typography>
                </Container>
                <Container maxWidth="xl" sx={{ py: 1 }}>
                  <Divider />
                </Container>
                <Grid container>
                  {moving.map(mov => (
                    <Grid item md key={mov} sx={{ p: 1 }}>
                      <video
                        autoPlay
                        playsInline
                        muted
                        loop
                        style={{ width: "100%", borderRadius: 6, cursor: "pointer", filter: "grayscale(100%)" }}
                        onClick={() => handleSelectVisual(mov)}
                        crossOrigin="anonymous"
                        src={`${GS_URL}/${member}/${mov}`}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </>
          )}
          {page === 2 && (
            <>
              <Container maxWidth="xl" sx={{ mb: 3 }}>
                <Typography variant="overline">
                  Step 03. Choose one text card and one auditory card to complete
                </Typography>
              </Container>
              <Container maxWidth="xl">
                <Typography variant="h5">TEXT</Typography>
              </Container>
              <Container maxWidth="xl" sx={{ py: 1 }}>
                <Divider />
              </Container>
              <Grid container>
                <Grid container>
                  {textWhite.map(txt => (
                    <Grid item md key={txt} sx={{ p: 1 }}>
                      <img
                        src={`${GS_URL}/${member}/${txt}`}
                        alt={`${member} ${txt}`}
                        style={{ width: "100%", borderRadius: 6, cursor: "pointer", backgroundColor: "black" }}
                        onClick={async () => await handleAddText(txt)}
                        crossOrigin="anonymous"
                      />
                    </Grid>
                  ))}
                </Grid>
                <Grid container>
                  {textBlack.map(txt => (
                    <Grid item md key={txt} sx={{ p: 1 }}>
                      <img
                        src={`${GS_URL}/${member}/${txt}`}
                        alt={`${member} ${txt}`}
                        style={{ width: "100%", borderRadius: 6, cursor: "pointer", border: "1px solid black" }}
                        onClick={async () => await handleAddText(txt)}
                        crossOrigin="anonymous"
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Container maxWidth="xl">
                <Typography variant="h5">AUDITORY</Typography>
              </Container>
              <Container maxWidth="xl" sx={{ py: 1 }}>
                <Divider />
              </Container>
              <Grid container>
                {audio.map((au, i) => (
                  <Grid item md key={au}>
                    <Card
                      elevation={0}
                      sx={{
                        m: 1,
                        border: "2px solid",
                        borderColor: selAudio === au ? "primary.main" : "rgba(0, 0, 0, 0.12)",
                        cursor: "pointer",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        display: "flex",
                      }}
                      onClick={async () => await handleAddAudio(au)}
                    >
                      <CardContent sx={{ m: 0 }}>
                        <Typography variant="body1">{audioText[i].toUpperCase().replace(/_/g, " ")}</Typography>
                        <audio
                          preload
                          crossOrigin="anonymous"
                          src={`${GS_URL}/${member}/${au}`}
                          ref={selAudio === au ? audioRef : null}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
          <Grid container justifyContent="center" sx={{ mt: 4 }} spacing={2}>
            {page > 1 && (
              <Grid item md>
                <Button variant="contained" color="primary" onClick={() => setPage(page => page - 1)} fullWidth>
                  Back
                </Button>
              </Grid>
            )}
            {!!selVisual && page === 1 && (
              <Grid item md>
                <Button variant="contained" color="primary" onClick={() => setPage(page => page + 1)} fullWidth>
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
                  {loading ? <CircularProgress size="1.5em" disableShrink /> : "Download"}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DigitalSouvenir;
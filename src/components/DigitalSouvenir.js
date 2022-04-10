import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, CardContent, CircularProgress, Container, Divider, Grid, Typography } from "@mui/material";
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
  const [selVisual, setSelVisual] = useState(null);
  const [selText, setSelText] = useState(null);
  const [selAudio, setSelAudio] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
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

  function handleSelectVisual(visual) {
    setSelVisual(visual);
    setSelText(null);
    setSelAudio(null);
    setOutput(visual);
  }

  async function handleAddText(text) {
    const delay = setTimeout(() => setLoading(true), 1000);
    setSelText(text);
    await ffmpeg.load();
    ffmpeg.FS("writeFile", selVisual, await fetchFile(`${GS_URL}/${member}/${selVisual}`));
    ffmpeg.FS("writeFile", text, await fetchFile(`${GS_URL}/${member}/${text}`));
    await ffmpeg.run(
      "-i",
      selVisual,
      "-i",
      text,
      "-filter_complex",
      `[0${selVisual.endsWith("mp4") ? ":v" : ""}][1] overlay=0:0`,
      "-c:v",
      selVisual.endsWith("mp4") ? "libx264" : "png",
      "-pix_fmt",
      "rgba",
      `${selVisual}_${text}`,
    );
    const data = ffmpeg.FS("readFile", `${selVisual}_${text}`);
    const type = selVisual.endsWith("mp4") ? "video/mp4" : "image/png";
    setOutput(URL.createObjectURL(new Blob([data.buffer], { type })));
    clearTimeout(delay);
    setLoading(false);
  }

  async function handleAddAudio(audio) {
    setSelAudio(audio);
    const delay = setTimeout(() => setLoading(true), 1000);
    await ffmpeg.load();
    ffmpeg.FS("writeFile", `${selVisual}_${selText}`, await fetchFile(output));
    ffmpeg.FS("writeFile", audio, await fetchFile(`${GS_URL}/${member}/${audio}`));
    await ffmpeg.run(
      ...(selVisual.endsWith("mp4") ? [] : ["-loop", "1"]),
      "-i",
      `${selVisual}_${selText}`,
      "-i",
      audio,
      "-c:v",
      selVisual.endsWith("mp4") ? "copy" : "libx264",
      ...(selVisual.endsWith("mp4") ? [] : ["-tune", "stillimage"]),
      "-c:a",
      "copy",
      ...(selVisual.endsWith("mp4") ? [] : ["-pix_fmt", "yuv420p"]),
      "-shortest",
      `${selVisual}_${selText}_${audio}.mp4`,
    );
    const data = ffmpeg.FS("readFile", `${selVisual}_${selText}_${audio}.mp4`);
    setOutput(URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" })));
    clearTimeout(delay);
    setLoading(false);
  }

  async function handleDownload() {
    saveAs(output, `${member}-digital-souvenir.mp4`);
  }

  return (
    <Container sx={{ minHeight: "100vh", py: "2em" }} maxWidth="xl">
      <Grid container>
        <Grid item md={4}>
          {loading ? (
            <Grid container alignContent="center" justifyContent="center">
              <CircularProgress size="2em" />
            </Grid>
          ) : output == null ? null : output.endsWith("mp4") || selAudio != null ? (
            <video
              autoPlay
              loop={!selAudio}
              playsInline
              muted={!selAudio}
              controls={!!selAudio}
              style={{ width: "100%", borderRadius: 6 }}
              src={output.startsWith("blob") ? output : `${GS_URL}/${member}/${output}`}
              crossOrigin="anonymous"
            />
          ) : (
            <img
              src={output.startsWith("blob") ? output : `${GS_URL}/${member}/${output}`}
              style={{ width: "100%", borderRadius: 6 }}
              alt={`${member} ${output}`}
              crossOrigin="anonymous"
            />
          )}
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
                      style={{ width: "100%", borderRadius: 6, cursor: "pointer" }}
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
                        style={{ width: "100%", borderRadius: 6, cursor: "pointer" }}
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
                  <Grid item md key={au} sx={{ p: 1 }}>
                    <Card
                      elevation={0}
                      sx={{
                        border: "1px solid",
                        borderColor: selAudio === au ? "primary.main" : "rgba(0, 0, 0, 0.12)",
                        cursor: "pointer",
                      }}
                      onClick={async () => await handleAddAudio(au)}
                    >
                      <CardContent>
                        <Typography variant="body1">{audioText[i]}</Typography>
                        <audio controls crossOrigin="anonymous">
                          <source src={`${GS_URL}/${member}/${au}`} type="audio/mpeg" />
                        </audio>
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
                <Button variant="contained" color="primary" onClick={handleDownload} fullWidth>
                  Download
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

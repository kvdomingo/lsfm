import "./App.css";
import { AppBar, Container, Grid, Toolbar } from "@mui/material";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";
import DigitalSouvenir from "./components/DigitalSouvenir";
import GAUtil from "./components/GAUtil";

const { NODE_ENV, PUBLIC_URL } = process.env;

const GS_URL = process.env.REACT_APP_GS_URL;

const members = ["sakura", "garam", "eunchae", "chaewon", "kazuha", "yunjin"];

function CardDeck() {
  return (
    <Container sx={{ minHeight: "100vh", mt: 4, py: "2em" }}>
      <Grid container>
        {members.map(member => (
          <Grid
            item
            md={4}
            key={member}
            sx={{
              "p": 2,
              "img:hover": {
                boxShadow: "0 0 20px 1px rgba(0, 0, 0, 0.25)",
                transition: "box-shadow 300ms ease",
              },
            }}
          >
            <Link
              to={`/digitalsouvenir/${member}`}
              onClick={() =>
                ReactGA.event({
                  category: "card",
                  action: "click",
                  label: member,
                })
              }
            >
              <img
                src={`${GS_URL}/${member}/card.png`}
                alt={`${member} card`}
                style={{
                  width: "100%",
                  borderRadius: 6,
                }}
                crossOrigin="anonymous"
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function App() {
  return (
    <Router>
      {NODE_ENV === "production" && <GAUtil />}
      <AppBar color="inherit" sx={{ boxShadow: "none" }}>
        <Container>
          <Toolbar disableGutters sx={{ justifyContent: "center" }}>
            <Link to="/">
              <img src={`${PUBLIC_URL}/logo_dark.svg`} alt="LE SSERAFIM" width={150} />
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
      <Routes>
        <Route path="/" element={<CardDeck />} />
        <Route path="/digitalsouvenir/:member" element={<DigitalSouvenir />} />
      </Routes>
    </Router>
  );
}

export default App;

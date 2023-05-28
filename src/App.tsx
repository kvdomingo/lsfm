import ReactGA from "react-ga4";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AppBar, Container, Grid, Toolbar } from "@mui/material";

import "./App.css";
import DigitalSouvenir from "./components/DigitalSouvenir";
import GAUtil from "./components/GAUtil";

const { NODE_ENV, VITE_GS_URL } = import.meta.env;

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
                src={`${VITE_GS_URL}/${member}/card.png`}
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
              <img src="/logo_dark.svg" alt="LE SSERAFIM" width={150} />
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

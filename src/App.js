import "./App.css";
import { Container, Grid } from "@mui/material";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import DigitalSouvenir from "./components/DigitalSouvenir";

const GS_URL = process.env.REACT_APP_GS_URL;

const members = ["sakura", "garam", "eunchae", "chaewon", "kazuha", "yunjin"];

function CardDeck() {
  return (
    <Container sx={{ minHeight: "100vh", py: "2em" }}>
      <Grid container>
        {members.map(member => (
          <Grid item md={4} key={member} sx={{ p: 2 }}>
            <Link to={`/digitalsouvenir/${member}`}>
              <img
                src={`${GS_URL}/${member}/card.png`}
                alt={`${member} card`}
                style={{ width: "100%", borderRadius: 6 }}
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
      <Routes>
        <Route path="/" element={<CardDeck />} />
        <Route path="/digitalsouvenir/:member" element={<DigitalSouvenir />} />
      </Routes>
    </Router>
  );
}

export default App;

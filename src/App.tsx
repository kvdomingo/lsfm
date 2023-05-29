import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.css";
import CardDeck from "./components/cardDeck/CardDeck.tsx";
import DigitalSouvenir from "./components/digitalSouvenir/DigitalSouvenir.tsx";
import GAUtil from "./components/utils/GAUtil.tsx";

const { NODE_ENV } = import.meta.env;

function App() {
  return (
    <Router>
      {NODE_ENV === "production" && <GAUtil />}
      <header className="py-4 text-center">
        <Link to="/">
          <img src="/logo_light.svg" alt="LE SSERAFIM" width={150} />
        </Link>
      </header>
      <Routes>
        <Route path="/" element={<CardDeck />} />
        <Route path="/digitalsouvenir/:member" element={<DigitalSouvenir />} />
      </Routes>
    </Router>
  );
}

export default App;

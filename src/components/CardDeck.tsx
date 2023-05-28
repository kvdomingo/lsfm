import ReactGA from "react-ga4";
import { Link } from "react-router-dom";

import { Container, Grid } from "@mui/material";

import { members } from "../constants.ts";
import Image from "./Image.tsx";

function CardDeck() {
  return (
    <Container className="min-h-screen py-8">
      <Grid container>
        {members.map(member => (
          <Grid item md={4} key={member} className="p-4">
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
              <Image
                path={`${member}/card.png`}
                className="w-full transition-all ease-in-out duration-300 hover:-translate-y-1"
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default CardDeck;

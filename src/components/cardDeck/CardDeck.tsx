import ReactGA from "react-ga4";
import { Link } from "react-router-dom";

import { members } from "@/constants.ts";

import Image from "../common/Image.tsx";

function CardDeck() {
  const handleClick = (member: string) => () => {
    ReactGA.event({
      category: "card",
      action: "click",
      label: member,
    });
  };

  return (
    <div className="container mx-auto grid min-h-screen grid-cols-1 py-4 md:grid-cols-3">
      {members.map(member => (
        <div key={member} className="p-4">
          <Link to={`/digitalsouvenir/${member}`} onClick={handleClick(member)}>
            <Image
              path={`${member}/card.png`}
              className="w-full transition-all duration-300 ease-in-out hover:-translate-y-1"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default CardDeck;

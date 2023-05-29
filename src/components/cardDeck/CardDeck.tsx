import ReactGA from "react-ga4";
import { Link } from "react-router-dom";

import { members } from "../../constants.ts";
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
    <div className="container min-h-screen py-4 mx-auto grid grid-cols-1 md:grid-cols-3">
      {members.map(member => (
        <div key={member} className="p-4">
          <Link to={`/digitalsouvenir/${member}`} onClick={handleClick(member)}>
            <Image
              path={`${member}/card.png`}
              className="w-full transition-all ease-in-out duration-300 hover:-translate-y-1"
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default CardDeck;

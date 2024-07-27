import { Link, createLazyFileRoute } from "@tanstack/react-router";

import Image from "@/components/common/Image.tsx";
import { members } from "@/constants.ts";

export const Route = createLazyFileRoute("/")({
  component: () => (
    <div className="container mx-auto grid min-h-screen grid-cols-1 py-4 md:grid-cols-3">
      {members.map(member => (
        <div key={member} className="p-4">
          <Link to="/digitalsouvenir/$member" params={{ member }}>
            <Image
              path={`${member}/card.png`}
              className="hover:-translate-y-1 w-full transition-all duration-300 ease-in-out"
            />
          </Link>
        </div>
      ))}
    </div>
  ),
});

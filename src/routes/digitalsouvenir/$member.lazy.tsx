import { createLazyFileRoute } from "@tanstack/react-router";

import DigitalSouvenir from "@/components/digitalSouvenir/DigitalSouvenir.tsx";

export const Route = createLazyFileRoute("/digitalsouvenir/$member")({
  component: DigitalSouvenir,
});

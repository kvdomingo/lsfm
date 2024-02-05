import { createLazyFileRoute } from "@tanstack/react-router";

import CardDeck from "@/components/cardDeck/CardDeck.tsx";

export const Route = createLazyFileRoute("/")({
  component: CardDeck,
});

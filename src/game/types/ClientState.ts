import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";

export type ClientState = {
  readonly status: "created" | "started" | "completed" | "forfeited";
  readonly gameId: string;
  readonly playerId: string;
  readonly username: string;
  readonly players: readonly Player[];
  readonly expiresAt: number;
  readonly chatMessages: readonly ChatMessage[];
  readonly hand: readonly Card[];
  readonly canPlayAt: number | null;
};

type Player = {
  readonly username: string;
  readonly handSize: number;
  readonly drawPileSize: number;
  readonly sidePileSize: number;
  readonly centerPileTopCard: Card | null;
};

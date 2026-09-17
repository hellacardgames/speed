import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";

export type ClientState = {
  readonly status: "created" | "started" | "completed" | "forfeited";
  readonly gameId: string;
  readonly playerId: string;
  readonly player: Player;
  readonly otherPlayer: OtherPlayer | null;
  readonly adminUsername: string;
  readonly expiresAt: number;
  readonly chatMessages: readonly ChatMessage[];
  readonly canPlayAt: number | null;
};

type Player = {
  readonly username: string;
  readonly hand: readonly Card[];
  readonly drawPileSize: number;
  readonly sidePileSize: number;
  readonly centerPileTopCard: Card | null;
};

type OtherPlayer = {
  readonly username: string;
  readonly handSize: number;
  readonly drawPileSize: number;
  readonly sidePileSize: number;
  readonly centerPileTopCard: Card | null;
};

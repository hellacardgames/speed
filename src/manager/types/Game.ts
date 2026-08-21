import type { ChatMessage } from "./ChatMessage.js";
import type { Player } from "./Player.js";

export type Game = CreatedGame | StartedGame | CompletedGame | ForfeitedGame;

type CreatedGame = {
  readonly status: "created";
  readonly id: string;
  readonly createdAt: number;
  readonly expiresAt: number;
  readonly chatMessages: ChatMessage[];
  readonly players: Player[];
};

type StartedGame = {
  readonly status: "started";
  readonly id: string;
  readonly createdAt: number;
  expiresAt: number;
  readonly chatMessages: ChatMessage[];
  readonly players: Player[];
  canPlayAt: number;
};

type CompletedGame = {
  readonly status: "completed";
  readonly id: string;
  readonly createdAt: number;
  readonly expiresAt: number;
  readonly chatMessages: ChatMessage[];
  readonly players: Player[];
};

type ForfeitedGame = {
  readonly status: "forfeited";
  readonly id: string;
  readonly createdAt: number;
  readonly expiresAt: number;
  readonly chatMessages: ChatMessage[];
  readonly players: Player[];
};

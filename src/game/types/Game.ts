import type { ChatMessage } from "./ChatMessage.js";
import type { Player } from "./Player.js";

export type Game = CreatedGame | StartedGame | CompletedGame | ForfeitedGame;

export type CreatedGame = {
  readonly status: "created";
  readonly id: string;
  readonly createdAt: number;
  readonly expiresAt: number;
  readonly chatMessages: readonly ChatMessage[];
  readonly players: Player[];
};

export type StartedGame = {
  readonly status: "started";
  readonly id: string;
  readonly createdAt: number;
  expiresAt: number;
  readonly chatMessages: readonly ChatMessage[];
  readonly players: Player[];
  canPlayAt: number;
};

export type CompletedGame = {
  readonly status: "completed";
  readonly id: string;
  readonly createdAt: number;
  readonly expiresAt: number;
  readonly chatMessages: readonly ChatMessage[];
  readonly players: Player[];
};

export type ForfeitedGame = {
  readonly status: "forfeited";
  readonly id: string;
  readonly createdAt: number;
  readonly expiresAt: number;
  readonly chatMessages: readonly ChatMessage[];
  readonly players: Player[];
};

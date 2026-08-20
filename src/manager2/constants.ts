import type { Card } from "./types/Card.js";

export const GAME_KEY = "speed";
export const MAX_GAMES = 50;
export const WATCHDOG_INTERVAL_MS = 10000;

export const EXPIRY_EXTENSION_MS = 300000; // 5 minutes
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 2;
export const MAX_HAND_SIZE = 5;
export const CAN_PLAY_AT_DELAY_MS = 3000;

export const CARDS: readonly Card[] = [
  { id: crypto.randomUUID(), rank: 2, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 3, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 4, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 5, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 6, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 7, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 8, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 9, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 10, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 11, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 12, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 13, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 14, suite: "clubs" },
  { id: crypto.randomUUID(), rank: 2, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 3, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 4, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 5, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 6, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 7, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 8, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 9, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 10, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 11, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 12, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 13, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 14, suite: "diamonds" },
  { id: crypto.randomUUID(), rank: 2, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 3, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 4, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 5, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 6, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 7, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 8, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 9, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 10, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 11, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 12, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 13, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 14, suite: "hearts" },
  { id: crypto.randomUUID(), rank: 2, suite: "spades" },
  { id: crypto.randomUUID(), rank: 3, suite: "spades" },
  { id: crypto.randomUUID(), rank: 4, suite: "spades" },
  { id: crypto.randomUUID(), rank: 5, suite: "spades" },
  { id: crypto.randomUUID(), rank: 6, suite: "spades" },
  { id: crypto.randomUUID(), rank: 7, suite: "spades" },
  { id: crypto.randomUUID(), rank: 8, suite: "spades" },
  { id: crypto.randomUUID(), rank: 9, suite: "spades" },
  { id: crypto.randomUUID(), rank: 10, suite: "spades" },
  { id: crypto.randomUUID(), rank: 11, suite: "spades" },
  { id: crypto.randomUUID(), rank: 12, suite: "spades" },
  { id: crypto.randomUUID(), rank: 13, suite: "spades" },
  { id: crypto.randomUUID(), rank: 14, suite: "spades" },
];

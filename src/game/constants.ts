import type { Card } from "./types/Card.js";

export const EXPIRY_EXTENSION_MS = 300000; // 5 minutes
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 2;
export const MAX_HAND_SIZE = 5;
export const INITIAL_HAND_SIZE = 5;
export const INITIAL_DRAW_PILE_SIZE = 15;
export const INITIAL_SIDE_PILE_SIZE = 5;
export const CAN_PLAY_AT_DELAY_MS = 3000;

export const CARDS: readonly Card[] = [
  { id: crypto.randomUUID(), rank: "2", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "3", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "4", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "5", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "6", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "7", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "8", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "9", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "10", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "J", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "Q", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "K", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "A", suit: "clubs" },
  { id: crypto.randomUUID(), rank: "2", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "3", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "4", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "5", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "6", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "7", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "8", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "9", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "10", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "J", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "Q", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "K", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "A", suit: "diamonds" },
  { id: crypto.randomUUID(), rank: "2", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "3", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "4", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "5", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "6", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "7", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "8", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "9", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "10", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "J", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "Q", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "K", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "A", suit: "hearts" },
  { id: crypto.randomUUID(), rank: "2", suit: "spades" },
  { id: crypto.randomUUID(), rank: "3", suit: "spades" },
  { id: crypto.randomUUID(), rank: "4", suit: "spades" },
  { id: crypto.randomUUID(), rank: "5", suit: "spades" },
  { id: crypto.randomUUID(), rank: "6", suit: "spades" },
  { id: crypto.randomUUID(), rank: "7", suit: "spades" },
  { id: crypto.randomUUID(), rank: "8", suit: "spades" },
  { id: crypto.randomUUID(), rank: "9", suit: "spades" },
  { id: crypto.randomUUID(), rank: "10", suit: "spades" },
  { id: crypto.randomUUID(), rank: "J", suit: "spades" },
  { id: crypto.randomUUID(), rank: "Q", suit: "spades" },
  { id: crypto.randomUUID(), rank: "K", suit: "spades" },
  { id: crypto.randomUUID(), rank: "A", suit: "spades" },
];

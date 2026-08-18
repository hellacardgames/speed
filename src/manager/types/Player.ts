import type { Card } from "./Card.js";
import type { GameEvent } from "./GameEvent.js";

export type Player = {
  readonly id: string;
  readonly userId: string;
  readonly username: string;
  readonly events: GameEvent[];
  readonly hand: Card[];
  readonly drawPile: Card[];
  readonly sidePile: Card[];
  readonly centerPile: Card[];
  hasNoPlayableCards: boolean;
};

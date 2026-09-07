import type { Card } from "./Card.js";
import type { GameEvent } from "./GameEvent.js";

export type Player = {
  readonly id: string;
  readonly userId: string;
  readonly username: string;
  readonly events: readonly GameEvent[];
  readonly hand: readonly Card[];
  readonly drawPile: readonly Card[];
  readonly sidePile: readonly Card[];
  readonly centerPile: readonly Card[];
  readonly hasNoPlayableCards: boolean;
};

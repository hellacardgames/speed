import { emitEvent, shuffle } from "@hellacardgames/lib";
import {
  CAN_PLAY_AT_DELAY_MS,
  CARDS,
  EXPIRY_EXTENSION_MS,
  MIN_PLAYERS,
} from "../constants.js";
import { initializeCenterPile } from "../lib/initializeCenterPile.js";
import { initializeDrawPile } from "../lib/initializeDrawPile.js";
import { initializeHand } from "../lib/initializeHand.js";
import { initializeSidePile } from "../lib/initializeSidePile.js";
import { requireOtherPlayer } from "../lib/requireOtherPlayer.js";
import { transitionGameToStarted } from "../lib/transitionGameToStarted.js";
import type { Game } from "../types/Game.js";

export function startGame(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.players.indexOf(player) !== 0) {
    return { success: false, error: "playerNotAdmin" } as const;
  }
  if (game.status !== "created") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (game.players.length < MIN_PLAYERS) {
    return { success: false, error: "minPlayersNotReached" } as const;
  }

  game = transitionGameToStarted(game);

  const otherPlayer = requireOtherPlayer(game, player.id);

  let cards = [...CARDS] as const;
  cards = shuffle(cards);

  ({ game, cards } = initializeSidePile(game, player.id, cards));
  ({ game, cards } = initializeCenterPile(game, player.id, cards));

  ({ game, cards } = initializeCenterPile(game, otherPlayer.id, cards));
  ({ game, cards } = initializeSidePile(game, otherPlayer.id, cards));

  ({ game, cards } = initializeDrawPile(game, player.id, cards));
  ({ game, cards } = initializeHand(game, player.id, cards));

  ({ game, cards } = initializeDrawPile(game, otherPlayer.id, cards));
  ({ game } = initializeHand(game, otherPlayer.id, cards));

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  game = { ...game, canPlayAt: Date.now() + CAN_PLAY_AT_DELAY_MS };
  game = emitEvent(game, {
    type: "canPlayAtUpdated",
    canPlayAt: game.canPlayAt,
  });

  game = emitEvent(game, { type: "gameStarted" });

  return { success: true, game } as const;
}

import { emitEvent } from "../../lib/emitEvent.js";
import { emitEventToPlayer } from "../../lib/emitEventToPlayer.js";
import { shuffleCards } from "../../lib/shuffleCards.js";
import {
  CAN_PLAY_AT_DELAY_MS,
  CARDS,
  EXPIRY_EXTENSION_MS,
  MIN_PLAYERS,
} from "../constants.js";
import { games } from "../games.js";
import type { Game } from "../types/Game.js";

type StartGameResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "gameNotFound"
        | "playerNotFound"
        | "invalidStatus"
        | "playerNotAdmin"
        | "minPlayersNotReached";
    };

export function startGame(gameId: string, playerId: string): StartGameResult {
  const game = games.get(gameId);
  if (!game) {
    return { success: false, error: "gameNotFound" };
  }
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }
  if (game.status !== "open") {
    return { success: false, error: "invalidStatus" };
  }
  if (game.players.indexOf(player) !== 0) {
    return { success: false, error: "playerNotAdmin" };
  }
  if (game.players.length < MIN_PLAYERS) {
    return { success: false, error: "minPlayersNotReached" };
  }
  const otherPlayer = game.players[1]!;
  const cards = [...CARDS];
  shuffleCards(cards);

  player.sidePile.push(...cards.splice(0, 5));
  emitEvent(game, {
    type: "playerSidePileInitialized",
    username: player.username,
    numCards: player.sidePile.length,
  });

  player.centerPile.push(...cards.splice(0, 1));
  emitEvent(game, {
    type: "playerCenterPileInitialized",
    username: player.username,
    card: player.centerPile[player.centerPile.length - 1]!,
  });

  otherPlayer.centerPile.push(...cards.splice(0, 1));
  emitEvent(game, {
    type: "playerCenterPileInitialized",
    username: otherPlayer.username,
    card: otherPlayer.centerPile[otherPlayer.centerPile.length - 1]!,
  });

  otherPlayer.sidePile.push(...cards.splice(0, 5));
  emitEvent(game, {
    type: "playerSidePileInitialized",
    username: otherPlayer.username,
    numCards: otherPlayer.sidePile.length,
  });

  player.drawPile.push(...cards.splice(0, 15));
  emitEvent(game, {
    type: "playerDrawPileInitialized",
    username: player.username,
    numCards: player.drawPile.length,
  });

  player.hand.push(...cards.splice(0, 5));
  emitEventToPlayer(player, { type: "handInitialized", cards: player.hand });
  emitEvent(game, {
    type: "playerHandInitialized",
    username: player.username,
    numCards: player.hand.length,
  });

  otherPlayer.drawPile.push(...cards.splice(0, 15));
  emitEvent(game, {
    type: "playerDrawPileInitialized",
    username: otherPlayer.username,
    numCards: otherPlayer.drawPile.length,
  });

  otherPlayer.hand.push(...cards.splice(0, 5));
  emitEventToPlayer(otherPlayer, {
    type: "handInitialized",
    cards: otherPlayer.hand,
  });
  emitEvent(game, {
    type: "playerHandInitialized",
    username: otherPlayer.username,
    numCards: otherPlayer.hand.length,
  });

  const startedGame: Game = {
    ...game,
    status: "started",
    expiresAt: Date.now() + EXPIRY_EXTENSION_MS,
    canPlayAt: Date.now() + CAN_PLAY_AT_DELAY_MS,
  };
  games.set(game.id, startedGame);
  emitEvent(startedGame, { type: "gameStarted" });
  emitEvent(startedGame, {
    type: "expirationUpdated",
    expiresAt: startedGame.expiresAt,
  });
  emitEvent(startedGame, {
    type: "canPlayAtUpdated",
    canPlayAt: startedGame.canPlayAt,
  });
  return { success: true };
}

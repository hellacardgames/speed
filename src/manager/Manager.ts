import {
  CAN_PLAY_AT_DELAY_MS,
  CARDS,
  EXPIRY_EXTENSION_MS,
  MAX_GAMES,
  MAX_HAND_SIZE,
  MAX_PLAYERS,
  MIN_PLAYERS,
} from "./constants.js";
import { Watchdog } from "./Watchdog.js";
import { emitEvent } from "../lib/emitEvent.js";
import { emitEventToPlayer } from "../lib/emitEventToPlayer.js";
import { isCardPlayable } from "./lib/isCardPlayable.js";
import { hasPlayableCard } from "./lib/hasPlayableCard.js";
import { shuffleCards } from "../lib/shuffleCards.js";
import type { ChatMessage } from "./types/ChatMessage.js";
import type { ClientState } from "./types/ClientState.js";
import type { Game } from "./types/Game.js";
import type { GameEvent } from "./types/GameEvent.js";
import type { Player } from "./types/Player.js";

export type CreateGameResult =
  | {
      readonly success: true;
      readonly gameId: string;
      readonly playerId: string;
    }
  | {
      readonly success: false;
      readonly error: "maxGamesReached";
    };

export type DrawCardResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "gameNotFound"
        | "playerNotFound"
        | "invalidStatus"
        | "canPlayAtNotReached"
        | "handFull"
        | "drawPileEmpty";
    };

export type GetClientStateAndClearEventsResult =
  | {
      readonly success: true;
      readonly state: ClientState;
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export type GetEventsAndClearAcknowledgedResult =
  | {
      readonly success: true;
      readonly events: readonly GameEvent[];
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export type GetJoinableGamesResult = {
  readonly games: readonly {
    readonly id: string;
    readonly numPlayers: number;
  }[];
};

export type JoinGameResult =
  | {
      readonly success: true;
      readonly playerId: string;
    }
  | {
      readonly success: false;
      readonly error:
        | "gameNotFound"
        | "invalidStatus"
        | "maxPlayersReached"
        | "alreadyInGame";
    };

export type LeaveGameResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export type PlayCardResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "gameNotFound"
        | "playerNotFound"
        | "invalidStatus"
        | "canPlayAtNotReached"
        | "cardNotFound"
        | "cardNotPlayable";
    };

export type ReportNoPlayableCardsResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "gameNotFound"
        | "playerNotFound"
        | "invalidStatus"
        | "canPlayAtNotReached"
        | "alreadyReported"
        | "hasPlayableCard"
        | "canDraw";
    };

export type SendChatResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export type StartGameResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "gameNotFound"
        | "invalidStatus"
        | "playerNotFound"
        | "playerNotAdmin"
        | "minPlayersNotReached";
    };

export class Manager {
  private readonly games: Map<string, Game>;
  private readonly watchdog: Watchdog<Game>;

  constructor() {
    this.games = new Map<string, Game>();
    this.watchdog = new Watchdog(this.games);
    this.watchdog.start();
  }

  createGame(userId: string, username: string): CreateGameResult {
    if (this.games.size === MAX_GAMES) {
      return { success: false, error: "maxGamesReached" };
    }
    const player: Player = {
      id: crypto.randomUUID(),
      userId,
      username,
      events: [],
      hand: [],
      drawPile: [],
      sidePile: [],
      centerPile: [],
      hasNoPlayableCards: false,
    };
    const createdAt = Date.now();
    const game: Game = {
      status: "open",
      id: crypto.randomUUID(),
      createdAt,
      expiresAt: createdAt + EXPIRY_EXTENSION_MS,
      chatMessages: [],
      players: [player],
    };
    this.games.set(game.id, game);
    return { success: true, gameId: game.id, playerId: player.id };
  }

  drawCard(gameId: string, playerId: string): DrawCardResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "playerNotFound" };
    }
    if (game.status !== "started") {
      return { success: false, error: "invalidStatus" };
    }
    if (Date.now() < game.canPlayAt) {
      return { success: false, error: "canPlayAtNotReached" };
    }
    if (player.hand.length >= MAX_HAND_SIZE) {
      return { success: false, error: "handFull" };
    }
    if (player.drawPile.length === 0) {
      return { success: false, error: "drawPileEmpty" };
    }
    game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
    emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });
    const card = player.drawPile.pop()!;
    player.hand.push(card);
    emitEventToPlayer(player, { type: "drewCard", card });
    emitEvent(game, { type: "playerDrewCard", username: player.username });
    return { success: true };
  }

  getClientStateAndClearEvents(
    gameId: string,
    playerId: string,
  ): GetClientStateAndClearEventsResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "playerNotFound" };
    }
    const state: ClientState = {
      status: game.status,
      gameId,
      playerId,
      username: player.username,
      players: game.players.map((p) => ({
        username: p.username,
        handSize: p.hand.length,
        drawPileSize: p.drawPile.length,
        sidePileSize: p.sidePile.length,
        centerPileTopCard: p.centerPile.length
          ? p.centerPile[p.centerPile.length - 1]!
          : null,
      })),
      expiresAt: game.expiresAt,
      chatMessages: game.chatMessages,
      hand: player.hand,
      canPlayAt: game.status === "started" ? game.canPlayAt : null,
    };
    player.events.length = 0;
    return { success: true, state };
  }

  getEventsAndClearAcknowledged(
    gameId: string,
    playerId: string,
    lastReadId: string | null,
  ): GetEventsAndClearAcknowledgedResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "playerNotFound" };
    }
    const lastReadEventIndex = player.events.findIndex(
      (e) => e.id === lastReadId,
    );
    player.events.splice(0, lastReadEventIndex + 1);
    return { success: true, events: player.events };
  }

  getJoinableGames(): GetJoinableGamesResult {
    return {
      games: Array.from(this.games.values())
        .filter((g) => g.status === "open" && g.players.length < MAX_PLAYERS)
        .map((g) => ({
          id: g.id,
          numPlayers: g.players.length,
        })),
    };
  }

  joinGame(gameId: string, userId: string, username: string): JoinGameResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    if (game.status !== "open") {
      return { success: false, error: "invalidStatus" };
    }
    if (game.players.length === MAX_PLAYERS) {
      return { success: false, error: "maxPlayersReached" };
    }
    if (game.players.find((p) => p.userId === userId)) {
      return { success: false, error: "alreadyInGame" };
    }
    const player: Player = {
      id: crypto.randomUUID(),
      userId,
      username,
      events: [],
      hand: [],
      drawPile: [],
      sidePile: [],
      centerPile: [],
      hasNoPlayableCards: false,
    };
    game.players.push(player);
    emitEvent(game, { type: "playerJoined", username });
    return { success: true, playerId: player.id };
  }

  leaveGame(gameId: string, playerId: string): LeaveGameResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const playerIndex = game.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {
      return { success: false, error: "playerNotFound" };
    }

    const player = game.players[playerIndex]!;
    emitEvent(game, { type: "playerLeft", username: player.username });

    game.players.splice(playerIndex, 1);

    if (game.status === "started" && game.players.length < MIN_PLAYERS) {
      const forfeitedGame: Game = {
        ...game,
        status: "forfeited",
        expiresAt: Date.now() + EXPIRY_EXTENSION_MS,
      };
      this.games.set(game.id, forfeitedGame);
      emitEvent(forfeitedGame, { type: "gameForfeited" });
      emitEvent(forfeitedGame, {
        type: "expirationUpdated",
        expiresAt: forfeitedGame.expiresAt,
      });
    }
    if (game.players.length === 0) {
      this.games.delete(game.id);
    }
    return { success: true };
  }

  playCard(
    gameId: string,
    playerId: string,
    cardId: string,
    isForOtherPlayerPile: boolean,
  ): PlayCardResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "playerNotFound" };
    }
    if (game.status !== "started") {
      return { success: false, error: "invalidStatus" };
    }
    if (Date.now() < game.canPlayAt) {
      return { success: false, error: "canPlayAtNotReached" };
    }
    const cardIndex = player.hand.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) {
      return { success: false, error: "cardNotFound" };
    }
    const otherPlayer = game.players.find((p) => p !== player)!;
    const targetPile = isForOtherPlayerPile
      ? otherPlayer.centerPile
      : player.centerPile;
    const card = player.hand[cardIndex]!;
    if (!isCardPlayable(card, targetPile)) {
      return { success: false, error: "cardNotPlayable" };
    }

    game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
    emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });

    player.hand.splice(cardIndex, 1);
    targetPile.push(card);
    emitEvent(game, {
      type: "cardPlayed",
      username: player.username,
      card,
      isForOtherPlayerPile,
    });

    if (otherPlayer.hasNoPlayableCards && hasPlayableCard(otherPlayer, game)) {
      otherPlayer.hasNoPlayableCards = false;
    }

    if (player.hand.length === 0 && player.drawPile.length === 0) {
      emitEvent(game, { type: "gameCompleted" });
      const completedGame: Game = {
        ...game,
        status: "completed",
      };
      this.games.set(game.id, completedGame);
    }

    return { success: true };
  }

  reportNoPlayableCards(
    gameId: string,
    playerId: string,
  ): ReportNoPlayableCardsResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "playerNotFound" };
    }
    if (game.status !== "started") {
      return { success: false, error: "invalidStatus" };
    }
    if (Date.now() < game.canPlayAt) {
      return { success: false, error: "canPlayAtNotReached" };
    }
    if (player.hasNoPlayableCards) {
      return { success: false, error: "alreadyReported" };
    }
    if (hasPlayableCard(player, game)) {
      return { success: false, error: "hasPlayableCard" };
    }
    if (player.drawPile.length > 0 && player.hand.length < MAX_HAND_SIZE) {
      return { success: false, error: "canDraw" };
    }

    game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
    emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });

    player.hasNoPlayableCards = true;

    const otherPlayer = game.players.find((p) => p !== player)!;
    if (otherPlayer.hasNoPlayableCards) {
      if (player.sidePile.length === 0 && otherPlayer.sidePile.length === 0) {
        const cards = [...player.centerPile, ...otherPlayer.centerPile];
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
      } else {
        const playerSidePileCard = player.sidePile.pop()!;
        player.centerPile.push(playerSidePileCard);
        emitEvent(game, {
          type: "cardDrawnFromSidePileToCenterPile",
          username: player.username,
          card: playerSidePileCard,
        });
        const otherPlayerSidePileCard = otherPlayer.sidePile.pop()!;
        otherPlayer.centerPile.push(otherPlayerSidePileCard);
        emitEvent(game, {
          type: "cardDrawnFromSidePileToCenterPile",
          username: otherPlayer.username,
          card: otherPlayerSidePileCard,
        });
      }
      player.hasNoPlayableCards = false;
      otherPlayer.hasNoPlayableCards = false;
      game.canPlayAt = Date.now() + CAN_PLAY_AT_DELAY_MS;
      emitEvent(game, {
        type: "canPlayAtUpdated",
        canPlayAt: game.canPlayAt,
      });
    }

    return { success: true };
  }

  sendChat(gameId: string, playerId: string, text: string): SendChatResult {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: "gameNotFound" };
    }
    const player = game.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: "playerNotFound" };
    }
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      username: player.username,
      text,
    };
    game.chatMessages.push(message);
    emitEvent(game, { type: "chat", message });
    return { success: true };
  }

  startGame(gameId: string, playerId: string): StartGameResult {
    const game = this.games.get(gameId);
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
    this.games.set(game.id, startedGame);
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
}

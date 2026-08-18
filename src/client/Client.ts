import type { CreateGameResult } from "../server/actions/createGame.js";
import type { DrawCardResult } from "../server/actions/drawCard.js";
import type { GetClientStateAndClearEventsResult } from "../server/actions/getClientStateAndClearEvents.js";
import type { GetEventsAndClearAcknowledgedResult } from "../server/actions/getEventsAndClearAcknowledged.js";
import type { GetJoinableGamesResult } from "../server/actions/getJoinableGames.js";
import type { JoinGameResult } from "../server/actions/joinGame.js";
import type { LeaveGameResult } from "../server/actions/leaveGame.js";
import type { PlayCardResult } from "../server/actions/playCard.js";
import type { ReportNoPlayableCardsResult } from "../server/actions/reportNoPlayableCards.js";
import type { SendChatResult } from "../server/actions/sendChat.js";
import type { StartGameResult } from "../server/actions/startGame.js";
import type { Card } from "../manager/types/Card.js";
import type { ChatMessage } from "../manager/types/ChatMessage.js";
import type { ClientState } from "../manager/types/ClientState.js";
import type { GameEvent } from "../manager/types/GameEvent.js";

export type {
  CreateGameResult,
  DrawCardResult,
  GetClientStateAndClearEventsResult,
  GetEventsAndClearAcknowledgedResult,
  GetJoinableGamesResult,
  JoinGameResult,
  LeaveGameResult,
  PlayCardResult,
  ReportNoPlayableCardsResult,
  SendChatResult,
  StartGameResult,
  Card,
  ChatMessage,
  ClientState,
  GameEvent,
};

type ClientConfig = {
  readonly baseUrl: string;
  readonly actionUrls: {
    readonly createGame: string;
    readonly drawCard: string;
    readonly getClientStateAndClearEvents: string;
    readonly getEventsAndClearAcknowledged: string;
    readonly getJoinableGames: string;
    readonly joinGame: string;
    readonly leaveGame: string;
    readonly playCard: string;
    readonly reportNoPlayableCards: string;
    readonly sendChat: string;
    readonly startGame: string;
  };
};

export class Client {
  private readonly actionUrls: ClientConfig["actionUrls"];

  constructor(config: ClientConfig) {
    this.actionUrls = {
      createGame: `${config.baseUrl}${config.actionUrls.createGame}`,
      drawCard: `${config.baseUrl}${config.actionUrls.drawCard}`,
      getClientStateAndClearEvents: `${config.baseUrl}${config.actionUrls.getClientStateAndClearEvents}`,
      getEventsAndClearAcknowledged: `${config.baseUrl}${config.actionUrls.getEventsAndClearAcknowledged}`,
      getJoinableGames: `${config.baseUrl}${config.actionUrls.getJoinableGames}`,
      joinGame: `${config.baseUrl}${config.actionUrls.joinGame}`,
      leaveGame: `${config.baseUrl}${config.actionUrls.leaveGame}`,
      playCard: `${config.baseUrl}${config.actionUrls.playCard}`,
      reportNoPlayableCards: `${config.baseUrl}${config.actionUrls.reportNoPlayableCards}`,
      sendChat: `${config.baseUrl}${config.actionUrls.sendChat}`,
      startGame: `${config.baseUrl}${config.actionUrls.startGame}`,
    };
  }

  async createGame(accessToken: string): Promise<CreateGameResult> {
    const response = await fetch(`${this.actionUrls.createGame}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    return result;
  }

  async drawCard(gameId: string, playerId: string): Promise<DrawCardResult> {
    const response = await fetch(`${this.actionUrls.drawCard}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result = await response.json();
    return result;
  }

  async getClientStateAndClearEvents(
    gameId: string,
    playerId: string,
  ): Promise<GetClientStateAndClearEventsResult> {
    const response = await fetch(
      `${this.actionUrls.getClientStateAndClearEvents}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, playerId }),
      },
    );
    const result = await response.json();
    return result;
  }

  async getEventsAndClearAcknowledged(
    gameId: string,
    playerId: string,
    lastReadId: string | null,
  ): Promise<GetEventsAndClearAcknowledgedResult> {
    const response = await fetch(
      `${this.actionUrls.getEventsAndClearAcknowledged}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, playerId, lastReadId }),
      },
    );
    const result = await response.json();
    return result;
  }

  async getJoinableGames(): Promise<GetJoinableGamesResult> {
    const response = await fetch(`${this.actionUrls.getJoinableGames}`, {
      method: "POST",
    });
    const result = await response.json();
    return result;
  }

  async joinGame(gameId: string, accessToken: string): Promise<JoinGameResult> {
    const response = await fetch(`${this.actionUrls.joinGame}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId }),
    });
    const result = await response.json();
    return result;
  }

  async leaveGame(gameId: string, playerId: string): Promise<LeaveGameResult> {
    const response = await fetch(`${this.actionUrls.leaveGame}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result = await response.json();
    return result;
  }

  async playCard(
    gameId: string,
    playerId: string,
    cardId: string,
  ): Promise<PlayCardResult> {
    const response = await fetch(`${this.actionUrls.playCard}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId, cardId }),
    });
    const result = await response.json();
    return result;
  }

  async reportNoPlayableCards(
    gameId: string,
    playerId: string,
  ): Promise<ReportNoPlayableCardsResult> {
    const response = await fetch(`${this.actionUrls.reportNoPlayableCards}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result = await response.json();
    return result;
  }

  async sendChat(
    gameId: string,
    playerId: string,
    text: string,
  ): Promise<SendChatResult> {
    const response = await fetch(`${this.actionUrls.sendChat}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId, text }),
    });
    const result = await response.json();
    return result;
  }

  async startGame(gameId: string, playerId: string): Promise<StartGameResult> {
    const response = await fetch(`${this.actionUrls.startGame}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result = await response.json();
    return result;
  }
}

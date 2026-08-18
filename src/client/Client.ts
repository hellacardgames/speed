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

export class Client {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createGame(accessToken: string): Promise<CreateGameResult> {
    const response = await fetch(`${this.baseUrl}/createGame`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    return result;
  }

  async drawCard(gameId: string, playerId: string): Promise<DrawCardResult> {
    const response = await fetch(`${this.baseUrl}/drawCard`, {
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
      `${this.baseUrl}/getClientStateAndClearEvents`,
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
      `${this.baseUrl}/getEventsAndClearAcknowledged`,
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
    const response = await fetch(`${this.baseUrl}/getJoinableGames`, {
      method: "POST",
    });
    const result = await response.json();
    return result;
  }

  async joinGame(gameId: string, accessToken: string): Promise<JoinGameResult> {
    const response = await fetch(`${this.baseUrl}/joinGame`, {
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
    const response = await fetch(`${this.baseUrl}/leaveGame`, {
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
    isForOtherPlayerPile: boolean,
  ): Promise<PlayCardResult> {
    const response = await fetch(`${this.baseUrl}/playCard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId, cardId, isForOtherPlayerPile }),
    });
    const result = await response.json();
    return result;
  }

  async reportNoPlayableCards(
    gameId: string,
    playerId: string,
  ): Promise<ReportNoPlayableCardsResult> {
    const response = await fetch(`${this.baseUrl}/reportNoPlayableCards`, {
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
    const response = await fetch(`${this.baseUrl}/sendChat`, {
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
    const response = await fetch(`${this.baseUrl}/startGame`, {
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

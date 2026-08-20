import type {
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
} from "../server/index.js";

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

import type { createServer } from "../server/index.js";

type Server = ReturnType<typeof createServer>;

type ServerResult<
  TServer extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routes: readonly { path: string; action: (...args: any[]) => any }[];
  },
  TPath extends TServer["routes"][number]["path"],
> = ReturnType<Extract<TServer["routes"][number], { path: TPath }>["action"]>;

export class Client {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async createGame(accessToken: string) {
    const response = await fetch(`${this.baseUrl}/createGame`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result: ServerResult<Server, "/createGame"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async drawCard(gameId: string, playerId: string) {
    const response = await fetch(`${this.baseUrl}/drawCard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result: ServerResult<Server, "/drawCard"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async getClientStateAndClearEvents(gameId: string, playerId: string) {
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
    const result: ServerResult<Server, "/getClientStateAndClearEvents"> =
      await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async getEventsAndClearAcknowledged(
    gameId: string,
    playerId: string,
    lastReadId: string | null,
  ) {
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
    const result: ServerResult<Server, "/getEventsAndClearAcknowledged"> =
      await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async getJoinableGames() {
    const response = await fetch(`${this.baseUrl}/getJoinableGames`, {
      method: "POST",
    });
    const result: ServerResult<Server, "/getJoinableGames"> =
      await response.json();
    return result;
  }

  async joinGame(gameId: string, accessToken: string) {
    const response = await fetch(`${this.baseUrl}/joinGame`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId }),
    });
    const result: ServerResult<Server, "/joinGame"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async leaveGame(gameId: string, playerId: string) {
    const response = await fetch(`${this.baseUrl}/leaveGame`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result: ServerResult<Server, "/leaveGame"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async playCard(
    gameId: string,
    playerId: string,
    cardId: string,
    isForOtherPlayerPile: boolean,
  ) {
    const response = await fetch(`${this.baseUrl}/playCard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId, cardId, isForOtherPlayerPile }),
    });
    const result: ServerResult<Server, "/playCard"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async reportNoPlayableCards(gameId: string, playerId: string) {
    const response = await fetch(`${this.baseUrl}/reportNoPlayableCards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result: ServerResult<Server, "/reportNoPlayableCards"> =
      await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async sendChat(gameId: string, playerId: string, text: string) {
    const response = await fetch(`${this.baseUrl}/sendChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId, text }),
    });
    const result: ServerResult<Server, "/sendChat"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }

  async startGame(gameId: string, playerId: string) {
    const response = await fetch(`${this.baseUrl}/startGame`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, playerId }),
    });
    const result: ServerResult<Server, "/startGame"> = await response.json();
    if (!result.success) {
      return { success: false, error: result.error } as const;
    }
    return result;
  }
}

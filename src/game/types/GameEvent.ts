import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";

export type GameEvent =
  | {
      readonly type: "canPlayAtUpdated";
      readonly id: string;
      readonly canPlayAt: number;
    }
  | {
      readonly type: "cardDrawnFromSidePileToCenterPile";
      readonly id: string;
      readonly username: string;
      readonly card: Card;
    }
  | {
      readonly type: "cardPlayed";
      readonly id: string;
      readonly username: string;
      readonly card: Card;
      readonly isForOtherPlayerPile: boolean;
    }
  | {
      readonly type: "chat";
      readonly id: string;
      readonly message: ChatMessage;
    }
  | {
      readonly type: "drewCard";
      readonly id: string;
      readonly card: Card;
    }
  | {
      readonly type: "expirationUpdated";
      readonly id: string;
      readonly expiresAt: number;
    }
  | {
      readonly type: "gameCompleted";
      readonly id: string;
    }
  | {
      readonly type: "gameForfeited";
      readonly id: string;
    }
  | {
      readonly type: "gameStarted";
      readonly id: string;
    }
  | {
      readonly type: "handInitialized";
      readonly id: string;
      readonly cards: readonly Card[];
    }
  | {
      readonly type: "playerCenterPileInitialized";
      readonly id: string;
      readonly username: string;
      readonly card: Card;
    }
  | {
      readonly type: "playerDrawPileInitialized";
      readonly id: string;
      readonly username: string;
      readonly numCards: number;
    }
  | {
      readonly type: "playerDrewCard";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "playerHandInitialized";
      readonly id: string;
      readonly username: string;
      readonly numCards: number;
    }
  | {
      readonly type: "playerJoined";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "playerLeft";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "playerSidePileInitialized";
      readonly id: string;
      readonly username: string;
      readonly numCards: number;
    };

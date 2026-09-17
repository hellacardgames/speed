import type { Card } from "./Card.js";
import type { ChatMessage } from "./ChatMessage.js";

export type GameEvent =
  | {
      readonly type: "adminChanged";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "canPlayAtUpdated";
      readonly id: string;
      readonly canPlayAt: number;
    }
  | {
      readonly type: "chat";
      readonly id: string;
      readonly message: ChatMessage;
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
      readonly type: "otherPlayerCenterPileInitialized";
      readonly id: string;
      readonly card: Card;
    }
  | {
      readonly type: "otherPlayerDrawPileInitialized";
      readonly id: string;
      readonly numCards: number;
    }
  | {
      readonly type: "otherPlayerDrewCard";
      readonly id: string;
    }
  | {
      readonly type: "otherPlayerHandInitialized";
      readonly id: string;
      readonly numCards: number;
    }
  | {
      readonly type: "otherPlayerJoined";
      readonly id: string;
      readonly username: string;
    }
  | {
      readonly type: "otherPlayerLeft";
      readonly id: string;
    }
  | {
      readonly type: "otherPlayerMovedCardFromSidePileToCenterPile";
      readonly id: string;
      readonly card: Card;
    }
  | {
      readonly type: "otherPlayerPlayedCard";
      readonly id: string;
      readonly card: Card;
      readonly isForOtherPlayerPile: boolean;
    }
  | {
      readonly type: "otherPlayerSidePileInitialized";
      readonly id: string;
      readonly numCards: number;
    }
  | {
      readonly type: "playerCenterPileInitialized";
      readonly id: string;
      readonly card: Card;
    }
  | {
      readonly type: "playerDrawPileInitialized";
      readonly id: string;
      readonly numCards: number;
    }
  | {
      readonly type: "playerDrewCard";
      readonly id: string;
      readonly card: Card;
    }
  | {
      readonly type: "playerHandInitialized";
      readonly id: string;
      readonly cards: readonly Card[];
    }
  | {
      readonly type: "playerMovedCardFromSidePileToCenterPile";
      readonly id: string;
      readonly card: Card;
    }
  | {
      readonly type: "playerPlayedCard";
      readonly id: string;
      readonly card: Card;
      readonly isForOtherPlayerPile: boolean;
    }
  | {
      readonly type: "playerSidePileInitialized";
      readonly id: string;
      readonly numCards: number;
    };

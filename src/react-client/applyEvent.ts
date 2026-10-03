import type { ClientState, GameEvent } from "../client/index.js";

export function applyEvent(
  previousState: ClientState,
  event: GameEvent,
): ClientState {
  switch (event.type) {
    case "adminChanged":
      return {
        ...previousState,
        adminUsername: event.username,
      };
    case "canPlayAtUpdated":
      return { ...previousState, canPlayAt: event.canPlayAt };
    case "chat":
      return {
        ...previousState,
        chatMessages: [...previousState.chatMessages, event.message],
      };
    case "expirationUpdated":
      return { ...previousState, expiresAt: event.expiresAt };
    case "gameCompleted":
      return { ...previousState, status: "completed" };
    case "gameForfeited":
      return { ...previousState, status: "forfeited" };
    case "gameStarted":
      return { ...previousState, status: "started" };
    case "otherPlayerCenterPileInitialized":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              centerPileTopCard: event.card,
            }
          : null,
      };
    case "otherPlayerDrawPileInitialized":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              drawPileSize: event.numCards,
            }
          : null,
      };
    case "otherPlayerDrewCard":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              handSize: previousState.otherPlayer.handSize + 1,
              drawPileSize: previousState.otherPlayer.drawPileSize - 1,
            }
          : null,
      };
    case "otherPlayerHandInitialized":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              handSize: event.numCards,
            }
          : null,
      };
    case "otherPlayerJoined":
      return {
        ...previousState,
        otherPlayer: {
          username: event.username,
          handSize: 0,
          drawPileSize: 0,
          sidePileSize: 0,
          centerPileTopCard: null,
        },
      };
    case "otherPlayerLeft":
      return {
        ...previousState,
        otherPlayer: null,
      };
    case "otherPlayerMovedCardFromSidePileToCenterPile":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              sidePileSize: previousState.otherPlayer.sidePileSize - 1,
              centerPileTopCard: event.card,
            }
          : null,
      };
    case "otherPlayerPlayedCard":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              handSize: previousState.otherPlayer.handSize - 1,
              centerPileTopCard: event.isForOtherPlayerPile
                ? previousState.otherPlayer.centerPileTopCard
                : event.card,
            }
          : null,
        player: {
          ...previousState.player,
          centerPileTopCard: event.isForOtherPlayerPile
            ? event.card
            : previousState.player.centerPileTopCard,
        },
      };
    case "otherPlayerSidePileInitialized":
      return {
        ...previousState,
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              sidePileSize: event.numCards,
            }
          : null,
      };
    case "playerCenterPileInitialized":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          centerPileTopCard: event.card,
        },
      };
    case "playerDrawPileInitialized":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          drawPileSize: event.numCards,
        },
      };
    case "playerDrewCard":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          hand: [...previousState.player.hand, event.card],
          drawPileSize: previousState.player.drawPileSize - 1,
        },
      };
    case "playerHandInitialized":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          hand: event.cards,
        },
      };
    case "playerMovedCardFromSidePileToCenterPile":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          sidePileSize: previousState.player.sidePileSize - 1,
          centerPileTopCard: event.card,
        },
      };
    case "playerPlayedCard":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          hand: previousState.player.hand.filter((c) => c.id !== event.card.id),
          centerPileTopCard: event.isForOtherPlayerPile
            ? previousState.player.centerPileTopCard
            : event.card,
        },
        otherPlayer: previousState.otherPlayer
          ? {
              ...previousState.otherPlayer,
              centerPileTopCard: event.isForOtherPlayerPile
                ? event.card
                : previousState.otherPlayer.centerPileTopCard,
            }
          : null,
      };
    case "playerSidePileInitialized":
      return {
        ...previousState,
        player: {
          ...previousState.player,
          sidePileSize: event.numCards,
        },
      };
  }
}

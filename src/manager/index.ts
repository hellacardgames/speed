export { Manager } from "./Manager.js";

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
} from "./Manager.js";

export type {
  Card,
  ChatMessage,
  ClientState,
  GameEvent,
} from "../game/index.js";

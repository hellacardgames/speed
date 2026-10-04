import { useCallback, useEffect, useMemo, useState } from "react";
import { applyEvent } from "./applyEvent.js";
import { createClient } from "../client/index.js";
import type { Client, ClientState, GameEvent } from "../client/index.js";

const GET_EVENTS_INTERVAL_MS = 500;

type UseGameStoreResult =
  | GameStore
  | GetClientStateAndClearEventsError
  | GetEventsAndClearAcknowledgedError
  | null;

export type GameStore = {
  readonly state: ClientState;
  readonly event: GameEvent | null;
  readonly completeEvent: () => void;
  readonly leaveGame: () => ReturnType<Client["leaveGame"]>;
  readonly drawCard: () => ReturnType<Client["drawCard"]>;
  readonly playCard: (
    cardId: string,
    isForOtherPlayerPile: boolean,
  ) => ReturnType<Client["playCard"]>;
  readonly reportNoPlayableCards: () => ReturnType<
    Client["reportNoPlayableCards"]
  >;
  readonly sendChat: (text: string) => ReturnType<Client["sendChat"]>;
  readonly startGame: () => ReturnType<Client["startGame"]>;
};

type GetClientStateAndClearEventsError = Extract<
  Awaited<ReturnType<Client["getClientStateAndClearEvents"]>>,
  { success: false }
>["error"];

type GetEventsAndClearAcknowledgedError = Extract<
  Awaited<ReturnType<Client["getEventsAndClearAcknowledged"]>>,
  { success: false }
>["error"];

export function useGameStore(
  baseUrl: string,
  gameId: string,
  playerId: string,
): UseGameStoreResult {
  const client = useMemo(() => createClient(baseUrl), [baseUrl]);

  const [initialState, setInitialState] = useState<ClientState | null>(null);

  const [state, setState] = useState<
    | ClientState
    | GetClientStateAndClearEventsError
    | GetEventsAndClearAcknowledgedError
    | null
  >(null);

  const [events, setEvents] = useState<GameEvent[]>([]);

  const [leaveGame, setLeaveGame] = useState<
    (() => ReturnType<Client["leaveGame"]>) | null
  >(null);

  useEffect(() => {
    const doGetClientState = async () => {
      const result = await client.getClientStateAndClearEvents(
        gameId,
        playerId,
      );
      if (!result.success) {
        setState(result.error);
        return;
      }
      setInitialState(result.state);
    };
    doGetClientState();
  }, [client, gameId, playerId]);

  useEffect(() => {
    if (!initialState) {
      return;
    }

    let intervalId: number | null = null;

    const eventIdTracker = new Set<string>();
    let lastReadEventId = "";
    let isLeaving = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(initialState);

    setLeaveGame(() => async () => {
      isLeaving = true;
      const result = await client.leaveGame(gameId, playerId);
      if (!result.success) {
        isLeaving = false;
      }
      return result;
    });

    intervalId = window.setInterval(async () => {
      if (isLeaving) {
        return;
      }
      const result = await client.getEventsAndClearAcknowledged(
        gameId,
        playerId,
        lastReadEventId,
      );
      if (!result.success) {
        if (intervalId !== null) {
          window.clearInterval(intervalId);
        }
        setState(result.error);
        return;
      }
      lastReadEventId = result.events[result.events.length - 1]?.id ?? "";
      const newEvents: GameEvent[] = [];
      for (const event of result.events) {
        if (eventIdTracker.has(event.id)) {
          console.warn("Duplicate event detected... Ignoring!", event);
          continue;
        }
        eventIdTracker.add(event.id);
        if (event.type === "chat") {
          setState((prev) => {
            if (typeof prev === "string" || prev === null) {
              return prev;
            }
            return applyEvent(prev, event);
          });
        } else {
          newEvents.push(event);
        }
        console.log(event);
      }
      if (newEvents.length > 0) {
        setEvents((prev) => [...prev, ...newEvents]);
      }
    }, GET_EVENTS_INTERVAL_MS);

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [client, initialState, gameId, playerId]);

  const event = events[0] ?? null;

  const completeEvent = useCallback(() => {
    if (!event) {
      return;
    }
    setState((prev) => {
      if (typeof prev === "string" || prev === null) {
        return prev;
      }
      return applyEvent(prev, event);
    });
    setEvents((prev) => prev.slice(1));
  }, [event]);

  const drawCard = useCallback(
    () => client.drawCard(gameId, playerId),
    [client, gameId, playerId],
  );

  const playCard = useCallback(
    (cardId: string, isForOtherPlayerPile: boolean) =>
      client.playCard(gameId, playerId, cardId, isForOtherPlayerPile),
    [client, gameId, playerId],
  );

  const reportNoPlayableCards = useCallback(
    () => client.reportNoPlayableCards(gameId, playerId),
    [client, gameId, playerId],
  );

  const sendChat = useCallback(
    (text: string) => client.sendChat(gameId, playerId, text),
    [client, gameId, playerId],
  );

  const startGame = useCallback(
    () => client.startGame(gameId, playerId),
    [client, gameId, playerId],
  );

  const gameStore = useMemo(() => {
    if (typeof state === "string" || state === null) {
      return state;
    }
    if (leaveGame === null) {
      return null;
    }
    return {
      state,
      event,
      completeEvent,
      leaveGame,
      drawCard,
      playCard,
      reportNoPlayableCards,
      sendChat,
      startGame,
    };
  }, [
    state,
    event,
    completeEvent,
    leaveGame,
    drawCard,
    playCard,
    reportNoPlayableCards,
    sendChat,
    startGame,
  ]);

  return gameStore;
}

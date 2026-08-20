import { GAME_KEY, WATCHDOG_INTERVAL_MS } from "./constants.js";

type Game = {
  readonly id: string;
  readonly expiresAt: number;
};

export class Watchdog<TGame extends Game> {
  private readonly games: Map<string, TGame>;

  constructor(games: Map<string, TGame>) {
    this.games = games;
  }

  start() {
    console.log(`watchdog start at ${Date.now()} (${GAME_KEY})`);
    setInterval(() => this.wakeUp(), WATCHDOG_INTERVAL_MS);
  }

  wakeUp() {
    const now = Date.now();
    // console.log(`watchdog wakeUp at ${now} (${GAME_KEY})`);
    for (const game of this.games.values()) {
      if (game.expiresAt <= now) {
        this.games.delete(game.id);
        console.log(`watchdog purged ${game.id} (${GAME_KEY})`);
      }
    }
  }
}

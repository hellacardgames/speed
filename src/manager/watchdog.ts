import { GAME_KEY, WATCHDOG_INTERVAL_MS } from "./constants.js";
import { games } from "./games.js";

class Watchdog {
  start() {
    console.log(`watchdog start at ${Date.now()} (${GAME_KEY})`);
    setInterval(() => this.wakeUp(), WATCHDOG_INTERVAL_MS);
  }

  wakeUp() {
    const now = Date.now();
    // console.log(`watchdog wakeUp at ${now} (${GAME_KEY})`);
    for (const game of games.values()) {
      if (game.expiresAt <= now) {
        games.delete(game.id);
        console.log(`watchdog purged ${game.id} (${GAME_KEY})`);
      }
    }
  }
}

export const watchdog = new Watchdog();

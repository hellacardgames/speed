type Game = {
  readonly players: {
    readonly events: { readonly id: string }[];
  }[];
};

type OmitId<T> = T extends unknown ? Omit<T, "id"> : never;

export function emitEvent<T extends Game>(
  game: T,
  data: OmitId<T["players"][number]["events"][number]>,
): void {
  const event = { ...data, id: crypto.randomUUID() };
  for (const p of game.players) {
    p.events.push(event);
  }
}

type Player = {
  readonly events: { readonly id: string }[];
};

type OmitId<T> = T extends unknown ? Omit<T, "id"> : never;

export function emitEventToPlayer<T extends Player>(
  player: T,
  data: OmitId<T["events"][number]>,
): void {
  player.events.push({ ...data, id: crypto.randomUUID() });
}

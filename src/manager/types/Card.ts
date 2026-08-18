export type Card = {
  readonly id: string;
  readonly rank: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
  readonly suite: "clubs" | "diamonds" | "hearts" | "spades";
};

export type Card = {
  readonly id: string;
  readonly rank:
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "J"
    | "Q"
    | "K"
    | "A";
  readonly suit: "clubs" | "diamonds" | "hearts" | "spades";
};

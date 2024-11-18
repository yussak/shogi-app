import { OPPONENT, PLAYER } from "@/consts";
import { Piece } from "@/types";

export const initialPieces: Piece[] = [
  { type: "pawn", position: [6, 0], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 1], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 2], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 3], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 4], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 5], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 6], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 7], owner: PLAYER, isPromoted: false },
  { type: "pawn", position: [6, 8], owner: PLAYER, isPromoted: false },

  { type: "pawn", position: [2, 0], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 1], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 2], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 3], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 4], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 5], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 6], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 7], owner: OPPONENT, isPromoted: false },
  { type: "pawn", position: [2, 8], owner: OPPONENT, isPromoted: false },
];

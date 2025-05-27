import { PLAYER } from "@/consts";
import { owner, Piece } from "@/types";
import { getPieceAtDestination } from "./pieceMovement";

/**
 * 駒台の駒を指定位置に打てるかどうかを判定
 */
export const canPlaceCapturedPiece = (pieces: Piece[], owner: owner, row: number, col: number): boolean => {
  // 二歩できなくする
  // 駒台の駒はpositionがないので今ある駒かがないところみたいな判定が必要なのでselectedPieceは使えない
  const isPawnInColumn = pieces.some(
    (p) => p.type === "pawn" && p.position[1] === col && !p.isPromoted && p.owner === owner
  );

  const isInvalidRow = owner === PLAYER ? row === 0 : row === 8;

  return !isPawnInColumn && !isInvalidRow;
};

/**
 * 指定位置が空いているかどうかを判定
 */
export const isPositionAvailable = (pieces: Piece[], row: number, col: number, owner: owner): boolean => {
  return (
    !pieces.some((p) => p.position[0] === row && p.position[1] === col) && // そのマスに駒がない
    !pieces.some((p) => p.type === "pawn" && !p.isPromoted && p.position[1] === col && p.owner === owner)
  ); // 同じ列に歩がない
};

/**
 * 駒が指定位置に移動可能かどうかを判定
 */
export const canMoveTo = (
  pieces: Piece[], 
  selectedPiece: Piece, 
  targetRow: number, 
  targetCol: number,
  getAvailablePositions: (piece: Piece) => [number, number][]
): boolean => {
  const { owner, position } = selectedPiece;

  // 移動先の駒のownerが同じなら移動できなくする
  const pieceAtDestination = getPieceAtDestination(pieces, targetRow, targetCol);
  if (pieceAtDestination && owner === pieceAtDestination.owner) {
    return false;
  }

  if (position == null) {
    // 駒台から打てる場所を表示
    return canPlaceCapturedPiece(pieces, owner, targetRow, targetCol);
  }

  const availablePositions = getAvailablePositions(selectedPiece);
  return availablePositions.some(([row, col]) => row === targetRow && col === targetCol);
}; 
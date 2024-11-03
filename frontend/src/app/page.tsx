"use client";

import Board from "@/components/ui/Board";
import CapturedPieces from "@/components/ui/CapturePieces";
import { OPPONENT, PLAYER } from "@/consts";
import { CapturedPiece, owner, Piece } from "@/types";
import { useState } from "react";

// TODO:右上から数えたい（できなそうだが）今は左が0番目に成ってる
const initialPieces: Piece[] = [
  { type: "fuhyou", position: [6, 0], owner: PLAYER, isPromoted: false },
  { type: "fuhyou", position: [6, 1], owner: PLAYER, isPromoted: false },
  { type: "fuhyou", position: [6, 2], owner: PLAYER, isPromoted: false },
  { type: "fuhyou", position: [6, 3], owner: PLAYER, isPromoted: false },
  { type: "fuhyou", position: [6, 4], owner: PLAYER, isPromoted: false },
  { type: "fuhyou", position: [6, 5], owner: PLAYER, isPromoted: false },
  { type: "fuhyou", position: [6, 6], owner: PLAYER, isPromoted: false },
  { type: "fuhyou", position: [6, 7], owner: PLAYER, isPromoted: false },
  { type: "fuhyou", position: [6, 8], owner: PLAYER, isPromoted: false },

  { type: "fuhyou", position: [2, 0], owner: OPPONENT, isPromoted: false },
  { type: "fuhyou", position: [2, 1], owner: OPPONENT, isPromoted: false },
  { type: "fuhyou", position: [2, 2], owner: OPPONENT, isPromoted: false },
  { type: "fuhyou", position: [2, 3], owner: OPPONENT, isPromoted: false },
  { type: "fuhyou", position: [2, 4], owner: OPPONENT, isPromoted: false },
  { type: "fuhyou", position: [2, 5], owner: OPPONENT, isPromoted: false },
  { type: "fuhyou", position: [2, 6], owner: OPPONENT, isPromoted: false },
  { type: "fuhyou", position: [2, 7], owner: OPPONENT, isPromoted: false },
  { type: "fuhyou", position: [2, 8], owner: OPPONENT, isPromoted: false },
];

export default function Home() {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPiece[]>([]);

  const rows = Array.from({ length: 9 });
  const columns = Array.from({ length: 9 });

  const getAvailablePositionsOfCapturedPiece = (owner: owner, targetRow: number, targetCol: number) => {
    const isFuhyoInColumn = pieces.some(
      (p) => p.type === "fuhyou" && p.position[1] === targetCol && !p.isPromoted && p.owner === owner
    );
    if (owner === PLAYER) {
      return (
        targetRow > 0 &&
        !pieces.some((p) => p.position[0] === targetRow && p.position[1] === targetCol) &&
        !isFuhyoInColumn
      );
    }
    return (
      targetRow < 8 &&
      !pieces.some((p) => p.position[0] === targetRow && p.position[1] === targetCol && !isFuhyoInColumn)
    );
  };

  // 駒がある位置に移動可能か判定するべき
  const canMoveTo = (selectedPiece: Piece, targetRow: number, targetCol: number) => {
    const { owner, position, type } = selectedPiece;

    if (position == null) {
      // 駒台から打てる場所を表示
      return getAvailablePositionsOfCapturedPiece(owner, targetRow, targetCol);
    }

    const [row, col] = position;

    if (type === "fuhyou") {
      if (owner === PLAYER) {
        return row - 1 === targetRow && col === targetCol;
      }
      return row + 1 === targetRow && col === targetCol;
    }
  };

  const generateRows = (owner: owner) => {
    // 1~8行目か0~7行目
    return owner === PLAYER
      ? Array.from({ length: 8 }, (_, row) => row + 1)
      : Array.from({ length: 8 }, (_, row) => row);
  };

  const generatePositions = (rows: number[]) => {
    return rows.flatMap((row) => Array.from({ length: 9 }, (_, col) => [row, col] as [number, number]));
  };

  const isPositionAvailable = (row: number, col: number, owner: owner) => {
    return (
      !pieces.some((p) => p.position[0] === row && p.position[1] === col) && // そのマスに駒がない
      !pieces.some((p) => p.type === "fuhyou" && !p.isPromoted && p.position[1] === col && p.owner === owner)
    ); // 同じ列に歩がない
  };

  // 移動可能な場所を表示するべき
  const getavailablePositions = (piece: Piece): [number, number][] => {
    const { type, position, owner } = piece;

    if (position == null) {
      const rows = generateRows(owner);
      return generatePositions(rows).filter(([row, col]) => isPositionAvailable(row, col, owner));
    }

    const [row, col] = position;

    if (type === "fuhyou") {
      if (owner === PLAYER) {
        return [[row - 1, col]];
      }
      return [[row + 1, col]];
    }

    return [];
  };

  const reset = () => {
    setPieces(initialPieces);
    setSelectedPiece(null);
    setCapturedPieces([]);
  };

  const addPieceToStand = (selectedPiece: Piece, pieceAtDestination: Piece) => {
    setCapturedPieces((prev) => [...prev, { type: pieceAtDestination.type, owner: selectedPiece.owner }]);
  };

  const isPromotionZone = (owner: string, row: number) => {
    return (owner === PLAYER && row <= 2) || (owner === OPPONENT && row >= 6);
  };

  const capturePiece = (selectedPiece: Piece, pieceAtDestination: Piece) => {
    // 相手の駒がいる場合は取る
    setPieces((prevPieces) => prevPieces.filter((p) => p !== pieceAtDestination));

    // 駒台に追加
    addPieceToStand(selectedPiece, pieceAtDestination);
  };

  const movePiece = (row: number, col: number, shouldPromote: boolean) => {
    setPieces((prevPieces) =>
      prevPieces.map((piece) =>
        piece === selectedPiece
          ? {
              ...piece,
              position: [row, col],
              isPromoted: piece.isPromoted || shouldPromote,
            }
          : piece
      )
    );

    setSelectedPiece(null);
  };

  const handleCellClick = (row: number, col: number) => {
    // 移動先のマスにある駒
    const pieceAtDestination = pieces.find((p) => p.position[0] === row && p.position[1] === col);

    if (!selectedPiece) {
      if (pieceAtDestination) setSelectedPiece(pieceAtDestination);
      return;
    }

    if (pieceAtDestination && pieceAtDestination.owner !== selectedPiece.owner) {
      capturePiece(selectedPiece, pieceAtDestination);
    }

    // 成れるかどうか
    const isEnableToPromote =
      !selectedPiece.isPromoted && "position" in selectedPiece && isPromotionZone(selectedPiece.owner, row);
    // 成るかどうか
    const shouldPromote = isEnableToPromote && window.confirm("成りますか？");

    // 駒を移動
    if (canMoveTo(selectedPiece, row, col)) {
      if (!selectedPiece.position) {
        setPieces((prevPieces) => [
          ...prevPieces,
          {
            ...selectedPiece,
            position: [row, col],
            isPromoted: false,
          },
        ]);

        setSelectedPiece(null);
        setCapturedPieces((prev) => prev.filter((p) => p != selectedPiece));
      }
      movePiece(row, col, shouldPromote);
    }
  };

  const handleCapturedPieceClick = (piece: CapturedPiece) => {
    setSelectedPiece(piece);
  };

  return (
    <div className="grid items-center justify-items-center">
      <main>
        <CapturedPieces
          pieces={capturedPieces.filter((piece) => piece.owner === OPPONENT)}
          handleCapturedPieceClick={handleCapturedPieceClick}
        />
        {/* TODO:一手戻すボタン用意 */}
        {/* TODO:一手進めるボタン用意 */}
        {/* TODO:駒台の駒を打てるようにする */}
        {/* TODO:と金の動ける場所を正しくする */}
        {/* TODO:選択中に他のコマを選択しても動かせないので対応 */}
        {/* TODO:自分の駒を取れてしまうので修正　例えば33と金34歩33歩とできてしまう */}

        <button onClick={reset}>平手配置</button>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(9, 70px)",
          }}
        >
          {rows.map((_, rowIndex) =>
            columns.map((_, colIndex) => {
              // マスに駒があるかを確認
              const piece = pieces.find((p) => p.position[0] === rowIndex && p.position[1] === colIndex);

              const movablePositions = selectedPiece ? getavailablePositions(selectedPiece) : [];
              const isavailablePosition = movablePositions.some(
                (position) => position[0] === rowIndex && position[1] === colIndex
              );

              return (
                <Board
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  piece={piece}
                  isavailablePosition={isavailablePosition}
                  selectedPiece={selectedPiece}
                  handleCellClick={handleCellClick}
                />
              );
            })
          )}
        </div>
        <CapturedPieces
          pieces={capturedPieces.filter((piece) => piece.owner === PLAYER)}
          handleCapturedPieceClick={handleCapturedPieceClick}
        />
      </main>
    </div>
  );
}

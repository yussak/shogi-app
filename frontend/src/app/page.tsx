"use client";

import CapturedPieces from "@/components/ui/CapturePieces";
import { useState } from "react";

type Piece = {
  type: "fuhyou";
  position: [number, number];
  owner: "player" | "opponent";
  isPromoted: boolean;
};

const PLAYER = "player";
const OPPONENT = "opponent";

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

// TODO:Pieceと分ける必要あるのか確認
type CapturedPiece = {
  type: string;
  owner: "player" | "opponent";
};

export default function Home() {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPiece[]>([]);

  const rows = Array.from({ length: 9 });
  const columns = Array.from({ length: 9 });

  const canMoveTo = (
    selectedPiece: Piece,
    targetRow: number,
    targetCol: number
  ) => {
    const { owner, position, type } = selectedPiece;

    if (!position) {
      const isFuhyoInColumn = pieces.some(
        (p) =>
          p.type === "fuhyou" &&
          p.position[1] === targetCol &&
          !p.isPromoted &&
          p.owner === owner
      );
      if (owner === PLAYER) {
        return (
          targetRow > 0 &&
          !pieces.some(
            (p) => p.position[0] === targetRow && p.position[1] === targetCol
          ) &&
          !isFuhyoInColumn
        );
      }
      return (
        targetRow < 8 &&
        !pieces.some(
          (p) =>
            p.position[0] === targetRow &&
            p.position[1] === targetCol &&
            !isFuhyoInColumn
        )
      );
    }

    const [row, col] = position;

    if (type === "fuhyou") {
      if (owner === PLAYER) {
        return row - 1 === targetRow && col === targetCol;
      }
      return row + 1 === targetRow && col === targetCol;
    }
  };

  // TODO:canMoveToと被ってるので直す（以下でcanMoveTo読めばいいだけかも
  const getMovablePositions = (piece: Piece | null): [number, number][] => {
    if (!piece) return [];

    const { type, position, owner } = piece;
    if (!position) {
      let movablePositions;
      if (owner === PLAYER) {
        movablePositions = Array.from({ length: 8 }, (_, row) => row + 1) // 1行目から8行目
          .flatMap((row) =>
            Array.from(
              { length: 9 },
              (_, col) => [row, col] as [number, number]
            )
          )
          .filter(
            ([row, col]) =>
              !pieces.some(
                (p) => p.position[0] === row && p.position[1] === col
              ) && // そのマスに駒がない
              !pieces.some(
                (p) =>
                  p.type === "fuhyou" &&
                  !p.isPromoted &&
                  p.position[1] === col &&
                  p.owner === owner
              ) // 同じ列に歩がない
          );
      } else {
        movablePositions = Array.from({ length: 8 }, (_, row) => row) // 0行目から7行目
          .flatMap((row) =>
            Array.from(
              { length: 9 },
              (_, col) => [row, col] as [number, number]
            )
          )
          .filter(
            ([row, col]) =>
              !pieces.some(
                (p) => p.position[0] === row && p.position[1] === col
              ) && // そのマスに駒がない
              !pieces.some(
                (p) =>
                  p.type === "fuhyou" &&
                  !p.isPromoted &&
                  p.position[1] === col &&
                  p.owner === owner
              ) // 同じ列に歩がない
          );
      }

      return movablePositions;
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
    setCapturedPieces((prev) => [
      ...prev,
      { type: pieceAtDestination.type, owner: selectedPiece.owner },
    ]);
  };

  const isPromotionZone = (owner: string, row: number) => {
    return (owner === PLAYER && row <= 2) || (owner === OPPONENT && row >= 6);
  };

  const capturePiece = (selectedPiece: Piece, pieceAtDestination: Piece) => {
    // 相手の駒がいる場合は取る
    setPieces((prevPieces) =>
      prevPieces.filter((p) => p !== pieceAtDestination)
    );

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
    const pieceAtDestination = pieces.find(
      (p) => p.position[0] === row && p.position[1] === col
    );

    if (!selectedPiece) {
      if (pieceAtDestination) setSelectedPiece(pieceAtDestination);
      return;
    }

    if (
      pieceAtDestination &&
      pieceAtDestination.owner !== selectedPiece.owner
    ) {
      capturePiece(selectedPiece, pieceAtDestination);
    }

    // 成れるかどうか
    const isEnableToPromote =
      !selectedPiece.isPromoted &&
      "position" in selectedPiece &&
      isPromotionZone(selectedPiece.owner, row);
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

  const handleCapturedPieceClick = (piece: Piece) => {
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
              const piece = pieces.find(
                (p) => p.position[0] === rowIndex && p.position[1] === colIndex
              );

              const movablePositions = selectedPiece
                ? getMovablePositions(selectedPiece)
                : [];
              const isMovablePosition = movablePositions.some(
                (pos) => pos[0] === rowIndex && pos[1] === colIndex
              );

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    width: "70px",
                    height: "70px",
                    border: "1px solid black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // 相手の駒の場合逆さまにする
                    transform:
                      piece?.owner === OPPONENT ? "rotate(180deg)" : "none",
                    backgroundColor: isMovablePosition
                      ? "#A3D2CA" // 移動可能位置の色
                      : selectedPiece &&
                        selectedPiece.position &&
                        selectedPiece.position[0] === rowIndex &&
                        selectedPiece.position[1] === colIndex
                      ? "#FFD700" // 選択中の駒の色
                      : "#F0D9B5",
                  }}
                >
                  {piece && piece.type === "fuhyou"
                    ? piece.isPromoted
                      ? "と"
                      : "歩"
                    : ""}
                </div>
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

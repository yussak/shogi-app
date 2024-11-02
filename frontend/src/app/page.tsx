"use client";

import { useState } from "react";

type Piece = {
  type: "fuhyou";
  position: [number, number];
  owner: "player" | "opponent";
};

const initialPieces: Piece[] = [
  { type: "fuhyou", position: [6, 0], owner: "player" },
  { type: "fuhyou", position: [6, 1], owner: "player" },
  { type: "fuhyou", position: [6, 2], owner: "player" },
  { type: "fuhyou", position: [6, 3], owner: "player" },
  { type: "fuhyou", position: [6, 4], owner: "player" },
  { type: "fuhyou", position: [6, 5], owner: "player" },
  { type: "fuhyou", position: [6, 6], owner: "player" },
  { type: "fuhyou", position: [6, 7], owner: "player" },
  { type: "fuhyou", position: [6, 8], owner: "player" },

  { type: "fuhyou", position: [1, 0], owner: "opponent" },
  { type: "fuhyou", position: [1, 1], owner: "opponent" },
  { type: "fuhyou", position: [1, 2], owner: "opponent" },
  { type: "fuhyou", position: [1, 3], owner: "opponent" },
  { type: "fuhyou", position: [1, 4], owner: "opponent" },
  { type: "fuhyou", position: [1, 5], owner: "opponent" },
  { type: "fuhyou", position: [1, 6], owner: "opponent" },
  { type: "fuhyou", position: [1, 7], owner: "opponent" },
  { type: "fuhyou", position: [1, 8], owner: "opponent" },
];

export default function Home() {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

  const rows = Array.from({ length: 9 });
  const columns = Array.from({ length: 9 });

  const canMoveTo = (
    selectedPiece: Piece,
    targetRow: number,
    targetCol: number
  ) => {
    return (
      selectedPiece.type === "fuhyou" &&
      selectedPiece.position[0] - 1 === targetRow &&
      selectedPiece.position[1] === targetCol
    );
  };

  const getMovablePositions = (piece: Piece | null): [number, number][] => {
    if (!piece) return [];

    const { type, position } = piece;
    const [row, col] = position;
    if (type === "fuhyou") {
      return [[row - 1, col]];
    }

    return [];
  };

  const movablePositions = selectedPiece
    ? getMovablePositions(selectedPiece)
    : [];

  const handleCellClick = (row: number, col: number) => {
    if (selectedPiece) {
      if (canMoveTo(selectedPiece, row, col)) {
        setPieces((prevPieces) =>
          prevPieces.map((piece) =>
            piece === selectedPiece ? { ...piece, position: [row, col] } : piece
          )
        );
      }
      setSelectedPiece(null);
    } else {
      const piece = pieces.find(
        (p) => p.position[0] === row && p.position[1] === col
      );
      if (piece) {
        setSelectedPiece(piece);
      }
    }
  };

  const reset = () => {
    setPieces(initialPieces);
    setSelectedPiece(null);
  };

  return (
    <div className="grid items-center justify-items-center">
      <main>
        {/* TODO：駒台用意 */}
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
                      piece?.owner === "opponent" ? "rotate(180deg)" : "none",
                    backgroundColor: isMovablePosition
                      ? "#A3D2CA" // 移動可能位置の色
                      : selectedPiece &&
                        selectedPiece.position[0] === rowIndex &&
                        selectedPiece.position[1] === colIndex
                      ? "#FFD700" // 選択中の駒の色
                      : "#F0D9B5",
                  }}
                >
                  {piece && piece.type === "fuhyou" ? "歩" : ""}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

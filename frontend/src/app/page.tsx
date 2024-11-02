"use client";

import CapturedPieces from "@/components/ui/CapturePieces";
import { useState } from "react";

type Piece = {
  type: "fuhyou";
  position: [number, number];
  owner: "player" | "opponent";
  isPromoted: boolean;
};

const initialPieces: Piece[] = [
  { type: "fuhyou", position: [6, 0], owner: "player", isPromoted: false },
  { type: "fuhyou", position: [6, 1], owner: "player", isPromoted: false },
  { type: "fuhyou", position: [6, 2], owner: "player", isPromoted: false },
  { type: "fuhyou", position: [6, 3], owner: "player", isPromoted: false },
  { type: "fuhyou", position: [6, 4], owner: "player", isPromoted: false },
  { type: "fuhyou", position: [6, 5], owner: "player", isPromoted: false },
  { type: "fuhyou", position: [6, 6], owner: "player", isPromoted: false },
  { type: "fuhyou", position: [6, 7], owner: "player", isPromoted: false },
  { type: "fuhyou", position: [6, 8], owner: "player", isPromoted: false },

  { type: "fuhyou", position: [2, 0], owner: "opponent", isPromoted: false },
  { type: "fuhyou", position: [2, 1], owner: "opponent", isPromoted: false },
  { type: "fuhyou", position: [2, 2], owner: "opponent", isPromoted: false },
  { type: "fuhyou", position: [2, 3], owner: "opponent", isPromoted: false },
  { type: "fuhyou", position: [2, 4], owner: "opponent", isPromoted: false },
  { type: "fuhyou", position: [2, 5], owner: "opponent", isPromoted: false },
  { type: "fuhyou", position: [2, 6], owner: "opponent", isPromoted: false },
  { type: "fuhyou", position: [2, 7], owner: "opponent", isPromoted: false },
  { type: "fuhyou", position: [2, 8], owner: "opponent", isPromoted: false },
];

type CapturedPiece = {
  type: string;
  owner: "player" | "opponent";
};

export default function Home() {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [capturedPlayerPieces, setCapturedPlayerPieces] = useState<
    CapturedPiece[]
  >([]);
  const [capturedOpponentPieces, setCapturedOpponentPieces] = useState<
    CapturedPiece[]
  >([]);
  const rows = Array.from({ length: 9 });
  const columns = Array.from({ length: 9 });

  const canMoveTo = (
    selectedPiece: Piece,
    targetRow: number,
    targetCol: number
  ) => {
    const { owner, position, type } = selectedPiece;
    const [row, col] = position;

    if (type === "fuhyou") {
      if (owner === "player") {
        return row - 1 === targetRow && col === targetCol;
      }
      return row + 1 === targetRow && col === targetCol;
    }
  };

  const getMovablePositions = (piece: Piece | null): [number, number][] => {
    if (!piece) return [];

    const { type, position, owner } = piece;
    const [row, col] = position;
    if (type === "fuhyou") {
      if (owner === "player") {
        return [[row - 1, col]];
      }
      return [[row + 1, col]];
    }

    return [];
  };

  const movablePositions = selectedPiece
    ? getMovablePositions(selectedPiece)
    : [];

  const reset = () => {
    setPieces(initialPieces);
    setSelectedPiece(null);
    setCapturedPlayerPieces([]);
    setCapturedOpponentPieces([]);
  };

  const addPieceToStand = (selectedPiece: Piece, targetPiece: Piece) => {
    if (selectedPiece.owner === "player") {
      setCapturedPlayerPieces((prev) => [
        ...prev,
        { type: targetPiece.type, owner: "player" },
      ]);
      return;
    }
    setCapturedOpponentPieces((prev) => [
      ...prev,
      { type: targetPiece.type, owner: "opponent" },
    ]);
  };

  const isPromotionZone = (owner: string, row: number) => {
    return (
      (owner === "player" && row <= 2) || (owner === "opponent" && row >= 6)
    );
  };

  const handleCellClick = (row: number, col: number) => {
    // targetPiece, selectedPieceの違いは何だ？
    const targetPiece = pieces.find(
      (p) => p.position[0] === row && p.position[1] === col
    );
    if (selectedPiece) {
      if (targetPiece && targetPiece.owner !== selectedPiece.owner) {
        // 相手の駒がいる場合は取る
        setPieces((prevPieces) => prevPieces.filter((p) => p !== targetPiece));

        // 駒台に追加
        addPieceToStand(selectedPiece, targetPiece);
      }

      // 成れるかどうか
      const isEnableToPromote =
        !selectedPiece.isPromoted && isPromotionZone(selectedPiece.owner, row);
      // 成るかどうか
      const shouldPromote = isEnableToPromote && window.confirm("成りますか？");

      // 駒を移動
      if (canMoveTo(selectedPiece, row, col)) {
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
      }
      return;
    }

    if (targetPiece) {
      setSelectedPiece(targetPiece);
    }
  };

  return (
    <div className="grid items-center justify-items-center">
      <main>
        <CapturedPieces pieces={capturedOpponentPieces} />
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
        <CapturedPieces pieces={capturedPlayerPieces} />
      </main>
    </div>
  );
}

"use client";

import CapturedPieces from "@/components/ui/CapturePieces";
import { OPPONENT, PLAYER } from "@/consts";
import { CapturedPiece, owner, Piece } from "@/types";
import { useState } from "react";
import Board from "@/components/ui/Board";
import { initialPieces, isPromotionZone } from "@/utils";

export default function Home() {
  const [pieces, setPieces] = useState<Piece[]>(initialPieces);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPiece[]>([]);

  const canPlaceCapturedPiece = (owner: owner, targetRow: number, targetCol: number) => {
    // 二歩できなくする
    // 駒台の駒はpositionがないので今ある駒かがないところみたいな判定が必要なのでselectedPieceは使えない
    const isPawnInColumn = pieces.some(
      (p) => p.type === "pawn" && p.position[1] === targetCol && !p.isPromoted && p.owner === owner
    );

    const isInvalidRow = owner === PLAYER ? targetRow === 0 : targetRow === 8;

    return !isPawnInColumn && !isInvalidRow;
  };

  // 駒がある位置に移動可能か判定
  const canMoveTo = (selectedPiece: Piece, targetRow: number, targetCol: number): boolean => {
    const { owner, position } = selectedPiece;

    if (position == null) {
      // 駒台から打てる場所を表示
      return canPlaceCapturedPiece(owner, targetRow, targetCol);
    }

    const availablePositions = getavailablePositions(selectedPiece);
    return availablePositions.some(([row, col]) => row === targetRow && col === targetCol);
  };

  // 移動可能な場所を表示する
  // TODO:駒台から移動させるとき可能な位置に色がつかなくなったので直す→テスト書いてから対応
  const getavailablePositions = (piece: Piece): [number, number][] => {
    const { type, position, owner } = piece;

    if (position == null) return [];

    const [row, col] = position;

    if (type === "pawn") {
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

  const capturePiece = (selectedPiece: Piece, pieceAtDestination: Piece) => {
    // 相手の駒がいる場合は取る
    setPieces((prevPieces) => prevPieces.filter((p) => p !== pieceAtDestination));

    // 駒台に追加
    setCapturedPieces((prev) => [...prev, { type: pieceAtDestination.type, owner: selectedPiece.owner }]);
  };

  // すでに駒台に置かれている駒を移動させる
  const moveExistingPiece = (selectedPiece: Piece, row: number, col: number, shouldPromote: boolean) => {
    setPieces((prevPieces) =>
      prevPieces.map((piece) =>
        piece === selectedPiece
          ? {
              ...selectedPiece,
              position: [row, col],
              isPromoted: piece.isPromoted || shouldPromote,
            }
          : piece
      )
    );
  };

  // 駒台にある駒を打つ
  const moveNewPiece = (piece: Piece, row: number, col: number) => {
    setPieces((prevPieces) => [
      ...prevPieces,
      {
        ...piece,
        position: [row, col],
        isPromoted: false,
      },
    ]);
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
        moveNewPiece(selectedPiece, row, col);
        setCapturedPieces((prev) => prev.filter((p) => p != selectedPiece));
        setSelectedPiece(null);
      }
      // すでに駒台に置かれている駒を移動させる
      moveExistingPiece(selectedPiece, row, col, shouldPromote);
    }
    setSelectedPiece(null);
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
        {/* TODO:と金の動ける場所を正しくする */}
        {/* TODO:選択中に他のコマを選択しても動かせないので対応 */}
        {/* TODO:自分の駒を取れてしまうので修正　例えば33と金34歩33歩とできてしまう */}

        <button onClick={reset}>平手配置</button>
        <Board
          pieces={pieces}
          selectedPiece={selectedPiece}
          handleCellClick={handleCellClick}
          getavailablePositions={getavailablePositions}
        />
        <CapturedPieces
          pieces={capturedPieces.filter((piece) => piece.owner === PLAYER)}
          handleCapturedPieceClick={handleCapturedPieceClick}
        />
      </main>
    </div>
  );
}

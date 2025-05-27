import CapturedPieces from "@/components/ui/CapturePieces";
import { OPPONENT, PLAYER } from "@/consts";
import { CapturedPiece, owner, Piece } from "@/types";
import { useState } from "react";
import Board from "@/components/ui/Board";
import { initialPieces, isPromotionZone } from "@/utils";
import { getPieceAtDestination, getPieceMovementPositions } from "@/utils/pieceMovement";
import { canMoveTo, isPositionAvailable } from "@/utils/gameRules";

type HomeProps = {
  initialPiecesOverride?: Piece[];
  debugMode?: boolean;
}

const GameArea = ({ initialPiecesOverride, debugMode = false }: HomeProps) => {
  const [pieces, setPieces] = useState<Piece[]>(initialPiecesOverride || initialPieces);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPiece[]>([]);
  const [currentTurn, setCurrentTurn] = useState<owner>(PLAYER); // 先手から開始
  const [isDebugMode, setIsDebugMode] = useState<boolean>(debugMode); // デバッグモード

  const switchTurn = () => {
    setCurrentTurn(currentTurn === PLAYER ? OPPONENT : PLAYER);
  };

  const toggleDebugMode = () => {
    setIsDebugMode(!isDebugMode);
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

  // 移動可能な場所を表示する
  const getAvailablePositions = (piece: Piece): [number, number][] => {
    const { position, owner } = piece;

    if (position == null) {
      const rows = generateRows(owner);
      return generatePositions(rows).filter(([row, col]) => isPositionAvailable(pieces, row, col, owner));
    }

    return getPieceMovementPositions(pieces, piece);
  };

  const reset = () => {
    setPieces(initialPieces);
    setSelectedPiece(null);
    setCapturedPieces([]);
    setCurrentTurn(PLAYER); // 先手から開始
    setIsDebugMode(false); // デバッグモードを無効化
  };

  const capturePiece = (selectedPiece: Piece, pieceAtDestination: Piece) => {
    // 相手の駒がいる場合は取る
    setPieces((prevPieces) => prevPieces.filter((p) => p !== pieceAtDestination));

    // 駒台に追加
    setCapturedPieces((prevPieces) => [...prevPieces, { type: pieceAtDestination.type, owner: selectedPiece.owner }]);
  };

  // すでに盤上に置かれている駒を移動させる
  const moveExistingPiece = (selectedPiece: Piece, row: number, col: number, shouldPromote: boolean) => {
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
  };

  // 駒台にある駒を打つ
  const moveCapturedPiece = (piece: Piece, row: number, col: number) => {
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
    const pieceAtDestination = getPieceAtDestination(pieces, row, col);
    if (!selectedPiece) {
      // デバッグモード時は制約なし、通常モードは自分のターンの駒のみ選択可能
      if (pieceAtDestination && (isDebugMode || pieceAtDestination.owner === currentTurn)) {
        setSelectedPiece(pieceAtDestination);
      }
      return;
    }

    if (canMoveTo(pieces, selectedPiece, row, col, getAvailablePositions) && pieceAtDestination && pieceAtDestination.owner !== selectedPiece.owner) {
      capturePiece(selectedPiece, pieceAtDestination);
    }

    // 成れるかどうか
    const isEnableToPromote =
      !selectedPiece.isPromoted && "position" in selectedPiece && isPromotionZone(selectedPiece.owner, row) && canMoveTo(pieces, selectedPiece, row, col, getAvailablePositions) && selectedPiece.type !== "gold" && selectedPiece.type !== "king";
    // 成るかどうか
    const shouldPromote = isEnableToPromote && window.confirm("成りますか？");

    // 駒を移動
    if (canMoveTo(pieces, selectedPiece, row, col, getAvailablePositions)) {
      if (!selectedPiece.position) {
        moveCapturedPiece(selectedPiece, row, col);
        setCapturedPieces((prev) => prev.filter((p) => p != selectedPiece));
        setSelectedPiece(null);
        if (!isDebugMode) switchTurn(); // デバッグモード時はターン切り替えしない
        return;
      }
      // すでに盤上に置かれている駒を移動させる
      moveExistingPiece(selectedPiece, row, col, shouldPromote);
      if (!isDebugMode) switchTurn(); // デバッグモード時はターン切り替えしない
    }
    setSelectedPiece(null);
  };

  const handleCapturedPieceClick = (piece: CapturedPiece) => {
    // デバッグモード時は制約なし、通常モードは自分のターンの駒のみ選択可能
    if (isDebugMode || piece.owner === currentTurn) {
      // TODO:治す
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSelectedPiece(piece as any);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundImage: "url('/images/tatami.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        {/* ターン表示 */}
        <div className="text-center py-4">
          <div className="inline-block bg-white bg-opacity-90 px-6 py-2 rounded-lg shadow-md">
            <span className="text-lg font-bold">
              {isDebugMode ? "デバッグモード" : `${currentTurn === PLAYER ? "先手" : "後手"}の番`}
            </span>
          </div>
        </div>
        <div className="flex items-start justify-center">
          <div className="self-start">
            <CapturedPieces
              pieces={capturedPieces.filter((piece) => piece.owner === OPPONENT)}
              handleCapturedPieceClick={handleCapturedPieceClick}
            />
          </div>
          <Board
            pieces={pieces}
            selectedPiece={selectedPiece}
            handleCellClick={handleCellClick}
            getAvailablePositions={getAvailablePositions}
          />
          <div className="self-end">
            <CapturedPieces
              pieces={capturedPieces.filter((piece) => piece.owner === PLAYER)}
              handleCapturedPieceClick={handleCapturedPieceClick}
            />
          </div>
        </div>
      </div>
      <div className="text-center space-x-2">
        <button type="button" onClick={reset} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">平手配置</button>
        <button type="button" onClick={toggleDebugMode} className={`font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:ring-4 focus:outline-none ${isDebugMode ? 'text-white bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800' : 'text-white bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'}`}>
          {isDebugMode ? "通常モード" : "デバッグモード"}
        </button>
      </div>
    </>
  )
}

export default GameArea;
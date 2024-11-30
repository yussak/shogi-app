import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";

const movePieceToRow = (from: number, to: number) => {
  fireEvent.click(screen.getByTestId(`piece-${from}-0`));
  fireEvent.click(screen.getByTestId(`cell-${to}-0`));
};

describe("先手", () => {
  describe("歩", () => {
    it("盤上の歩が1マス上に指せる", async () => {
      render(<Home />);

      // 初期位置に駒があることを確認
      const initialPiece = screen.getByTestId("piece-6-0");

      // セルの存在を確認
      const targetCell = screen.getByTestId("cell-5-0");

      fireEvent.click(initialPiece);
      fireEvent.click(targetCell);

      // 駒が移動したことを確認
      expect(initialPiece).not.toBeInTheDocument();
      expect(screen.getByTestId("piece-5-0")).toBeInTheDocument();
    });

    it("盤上の歩が1マス以外に指そうとしたら移動できない", async () => {
      render(<Home />);

      movePieceToRow(6, 4);

      expect(screen.queryByTestId("piece-6-0")).toBeInTheDocument();
      expect(screen.queryByTestId("piece-4-0")).not.toBeInTheDocument();
    });

    it("駒を取得したら盤上に追加される", async () => {
      render(<Home />);

      // 最初に駒台に駒はない
      expect(screen.queryByTestId("captured-piece-player")).toBeNull();

      // １マスずつ移動させる
      movePieceToRow(6, 5);
      movePieceToRow(5, 4);
      movePieceToRow(4, 3);
      movePieceToRow(3, 2);

      expect(screen.getByTestId("captured-piece-player")).toBeInTheDocument();
    });

    it("3マスより上にいる時に成れる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePieceToRow(6, 5);
      movePieceToRow(5, 4);
      movePieceToRow(4, 3);

      // 成るかの確認
      window.confirm = vi.fn(() => true);
      movePieceToRow(3, 2);

      const movedPiece = screen.getByTestId("piece-2-0");
      expect(movedPiece.textContent).not.toBe("歩");
      expect(movedPiece.textContent).toBe("と");
    });

    it("成ったり成らなかったりできる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePieceToRow(6, 5);
      movePieceToRow(5, 4);
      movePieceToRow(4, 3);

      // 成らない
      window.confirm = vi.fn(() => false);
      movePieceToRow(3, 2);

      const movedPiece = screen.getByTestId("piece-2-0");
      expect(movedPiece.textContent).toBe("歩");
      expect(movedPiece.textContent).not.toBe("と");

      // 成る
      window.confirm = vi.fn(() => true);
      movePieceToRow(2, 1);

      const promotedPiece = screen.getByTestId("piece-1-0");
      expect(promotedPiece.textContent).not.toBe("歩");
      expect(promotedPiece.textContent).toBe("と");
    });

    it("駒台の歩が打てる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePieceToRow(6, 5);
      movePieceToRow(5, 4);
      movePieceToRow(4, 3);

      window.confirm = vi.fn(() => true);
      movePieceToRow(3, 2);

      // 駒台をクリックして移動
      fireEvent.click(screen.getByTestId("captured-piece-player"));
      fireEvent.click(screen.getByTestId("cell-8-0"));

      expect(screen.getByTestId("piece-8-0")).toBeInTheDocument();
    });

    it("駒台から歩を打つ時に二歩できない", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePieceToRow(6, 5);
      movePieceToRow(5, 4);
      movePieceToRow(4, 3);

      window.confirm = vi.fn(() => false);
      movePieceToRow(3, 2);

      // 駒台をクリックして移動
      fireEvent.click(screen.getByTestId("captured-piece-player"));
      fireEvent.click(screen.getByTestId("cell-8-0"));

      expect(screen.queryByTestId("piece-8-0")).toBeNull();
    });

    it("進めなくなるので、駒台から１行目に打てない", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePieceToRow(6, 5);
      movePieceToRow(5, 4);
      movePieceToRow(4, 3);

      window.confirm = vi.fn(() => true);
      movePieceToRow(3, 2);

      // 駒台をクリックして移動
      fireEvent.click(screen.getByTestId("captured-piece-player"));
      fireEvent.click(screen.getByTestId("cell-0-0"));

      expect(screen.queryByTestId("piece-0-0")).toBeNull();
    });

    //   it("1マス目に指したら自動で成る", () => {
    //     // 未実装なので自動では成れない
    //   });

    //   it("自分の駒は取れない（多分未実装）", () => {
    //     //
    //   });

    //   it("移動可能じゃないポジションをクリックしたら選択解除される（実装済）", () => {
    //     //
    //   });
  });
});

describe("後手", () => {
  describe("歩", () => {
    it("盤上の歩が1マス上に指せる", async () => {
      render(<Home />);

      // 初期位置に駒があることを確認
      const initialPiece = screen.getByTestId("piece-2-0");

      // セルの存在を確認
      const targetCell = screen.getByTestId("cell-3-0");

      fireEvent.click(initialPiece);
      fireEvent.click(targetCell);

      // 駒が移動したことを確認
      expect(initialPiece).not.toBeInTheDocument();
      expect(screen.getByTestId("piece-3-0")).toBeInTheDocument();
    });

    it("盤上の歩が1マス以外に指そうとしたら移動できない", async () => {
      render(<Home />);

      movePieceToRow(2, 4);

      expect(screen.queryByTestId("piece-2-0")).toBeInTheDocument();
      expect(screen.queryByTestId("piece-4-0")).not.toBeInTheDocument();
    });

    it("駒を取得したら盤上に追加される", async () => {
      render(<Home />);

      // 最初に駒台に駒はない
      expect(screen.queryByTestId("captured-piece-opponent")).toBeNull();

      // １マスずつ移動させる
      movePieceToRow(2, 3);
      movePieceToRow(3, 4);
      movePieceToRow(4, 5);
      movePieceToRow(5, 6);

      expect(screen.getByTestId("captured-piece-opponent")).toBeInTheDocument();
    });

    it("7マスより下にいる時に成れる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePieceToRow(2, 3);
      movePieceToRow(3, 4);
      movePieceToRow(4, 5);

      // 成るかの確認
      window.confirm = vi.fn(() => true);
      movePieceToRow(5, 6);

      const movedPiece = screen.getByTestId("piece-6-0");
      expect(movedPiece.textContent).not.toBe("歩");
      expect(movedPiece.textContent).toBe("と");
    });

    it("成ったり成らなかったりできる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePieceToRow(2, 3);
      movePieceToRow(3, 4);
      movePieceToRow(4, 5);

      // 成らない
      window.confirm = vi.fn(() => false);
      movePieceToRow(5, 6);

      const movedPiece = screen.getByTestId("piece-6-0");
      expect(movedPiece.textContent).toBe("歩");
      expect(movedPiece.textContent).not.toBe("と");

      // 成る
      window.confirm = vi.fn(() => true);
      movePieceToRow(6, 7);

      const promotedPiece = screen.getByTestId("piece-7-0");
      expect(promotedPiece.textContent).not.toBe("歩");
      expect(promotedPiece.textContent).toBe("と");
    });

    it("駒台の歩が打てる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePieceToRow(2, 3);
      movePieceToRow(3, 4);
      movePieceToRow(4, 5);

      window.confirm = vi.fn(() => true);
      movePieceToRow(5, 6);

      // 駒台をクリックして移動
      fireEvent.click(screen.getByTestId("captured-piece-opponent"));
      fireEvent.click(screen.getByTestId("cell-0-0"));

      expect(screen.getByTestId("piece-0-0")).toBeInTheDocument();
    });

    it("駒台から歩を打つ時に二歩できない", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePieceToRow(2, 3);
      movePieceToRow(3, 4);
      movePieceToRow(4, 5);

      window.confirm = vi.fn(() => false);
      movePieceToRow(5, 6);

      // 駒台をクリックして移動
      fireEvent.click(screen.getByTestId("captured-piece-opponent"));
      fireEvent.click(screen.getByTestId("cell-0-0"));

      expect(screen.queryByTestId("piece-0-0")).toBeNull();
    });

    it("進めなくなるので、駒台から１行目に打てない", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePieceToRow(2, 3);
      movePieceToRow(3, 4);
      movePieceToRow(4, 5);

      window.confirm = vi.fn(() => true);
      movePieceToRow(5, 6);

      // 駒台をクリックして移動
      fireEvent.click(screen.getByTestId("captured-piece-opponent"));
      fireEvent.click(screen.getByTestId("cell-8-0"));

      expect(screen.queryByTestId("piece-8-0")).toBeNull();
    });

    //   it("1マス目に指したら自動で成る", () => {
    //     // 未実装なので自動では成れない
    //   });

    //   it("自分の駒は取れない（多分未実装）", () => {
    //     //
    //   });

    //   it("移動可能じゃないポジションをクリックしたら選択解除される（実装済）", () => {
    //     //
    //   });
  });
});

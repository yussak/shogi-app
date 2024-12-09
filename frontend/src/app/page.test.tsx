import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import Home from "./page";
import Board from "@/components/ui/Board";

const movePiece = ([fromRow, fromCol]: [number, number], [toRow, toCol]: [number, number]) => {
  fireEvent.click(screen.getByTestId(`piece-${fromRow}-${fromCol}`));
  fireEvent.click(screen.getByTestId(`cell-${toRow}-${toCol}`));
};

// TODO:テストしたい駒だけ置くようにしたい
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

    it("駒台の歩の選択可能な位置が色付きで表示される", async () => {
      render(<Home />);

      // 初期位置に駒があることを確認
      const element = screen.getByTestId("piece-6-0");
      fireEvent.click(element);

      // 移動可能位置が青い
      expect(window.getComputedStyle(screen.getByTestId("cell-5-0")).backgroundColor).toBe("rgb(163, 210, 202)");

      // そうじゃない位置は茶色
      expect(window.getComputedStyle(screen.getByTestId("cell-5-1")).backgroundColor).toBe("rgb(240, 217, 181)");
    });

    it("盤上の歩が1マス以外に指そうとしたら移動できない", async () => {
      render(<Home />);

      movePiece([6, 0], [4, 0]);

      expect(screen.queryByTestId("piece-6-0")).toBeInTheDocument();
      expect(screen.queryByTestId("piece-4-0")).not.toBeInTheDocument();
    });

    it("駒を取得したら盤上に追加される", async () => {
      render(<Home />);

      // 最初に駒台に駒はない
      expect(screen.queryByTestId("captured-piece-player")).toBeNull();

      // １マスずつ移動させる
      movePiece([6, 0], [5, 0]);
      movePiece([5, 0], [4, 0]);
      movePiece([4, 0], [3, 0]);
      movePiece([3, 0], [2, 0]);

      expect(screen.getByTestId("captured-piece-player")).toBeInTheDocument();
    });

    it("3マスより上にいる時に成れる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePiece([6, 0], [5, 0]);
      movePiece([5, 0], [4, 0]);
      movePiece([4, 0], [3, 0]);

      // 成るかの確認
      window.confirm = vi.fn(() => true);
      movePiece([3, 0], [2, 0]);

      const movedPiece = screen.getByTestId("piece-2-0");
      expect(movedPiece.textContent).not.toBe("歩");
      expect(movedPiece.textContent).toBe("と");
    });

    it("成ったり成らなかったりできる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePiece([6, 0], [5, 0]);
      movePiece([5, 0], [4, 0]);
      movePiece([4, 0], [3, 0]);

      // 成らない
      window.confirm = vi.fn(() => false);
      movePiece([3, 0], [2, 0]);

      const movedPiece = screen.getByTestId("piece-2-0");
      expect(movedPiece.textContent).toBe("歩");
      expect(movedPiece.textContent).not.toBe("と");

      // 成る
      window.confirm = vi.fn(() => true);
      movePiece([2, 0], [1, 0]);

      const promotedPiece = screen.getByTestId("piece-1-0");
      expect(promotedPiece.textContent).not.toBe("歩");
      expect(promotedPiece.textContent).toBe("と");
    });

    it("駒台の歩が打てる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePiece([6, 0], [5, 0]);
      movePiece([5, 0], [4, 0]);
      movePiece([4, 0], [3, 0]);

      window.confirm = vi.fn(() => true);
      movePiece([3, 0], [2, 0]);

      // 駒台をクリックして移動
      fireEvent.click(screen.getByTestId("captured-piece-player"));
      fireEvent.click(screen.getByTestId("cell-8-0"));

      expect(screen.getByTestId("piece-8-0")).toBeInTheDocument();
    });

    it("駒台から歩を打つ時に二歩できない", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePiece([6, 0], [5, 0]);
      movePiece([5, 0], [4, 0]);
      movePiece([4, 0], [3, 0]);

      window.confirm = vi.fn(() => false);
      movePiece([3, 0], [2, 0]);

      // 駒台をクリックして移動
      fireEvent.click(screen.getByTestId("captured-piece-player"));
      fireEvent.click(screen.getByTestId("cell-7-0"));

      expect(screen.queryByTestId("piece-7-0")).toBeNull();
    });

    // TODO:現状だと全てのコマを読んでしまうため、香車があるので8-0に置けずテストできない。そのため一時コメントアウトしてるので直す
    // it("進めなくなるので、駒台から１行目に打てない", () => {
    //   render(<Home />);

    //   // １マスずつ移動させる
    //   movePiece([6, 0], [5, 0]);
    //   movePiece([5, 0], [4, 0]);
    //   movePiece([4, 0], [3, 0]);

    //   window.confirm = vi.fn(() => true);
    //   movePiece([3, 0], [2, 0]);

    //   // 駒台をクリックして移動
    //   fireEvent.click(screen.getByTestId("captured-piece-player"));
    //   fireEvent.click(screen.getByTestId("cell-0-0"));

    //   expect(screen.queryByTestId("piece-0-0")).toBeNull();
    // });

    it("駒台から打つ時に移動可能な位置が青くなる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePiece([6, 0], [5, 0]);
      movePiece([5, 0], [4, 0]);
      movePiece([4, 0], [3, 0]);

      window.confirm = vi.fn(() => true);
      movePiece([3, 0], [2, 0]);

      // 駒台をクリック
      fireEvent.click(screen.getByTestId("captured-piece-player"));

      // 移動可能位置が青い
      expect(window.getComputedStyle(screen.getByTestId("cell-1-0")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-3-0")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-4-0")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-5-0")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-6-0")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-7-0")).backgroundColor).toBe("rgb(163, 210, 202)");

      // 移動できない位置は青くない
      expect(window.getComputedStyle(screen.getByTestId("cell-0-0")).backgroundColor).not.toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-2-0")).backgroundColor).not.toBe("rgb(163, 210, 202)");

      expect(window.getComputedStyle(screen.getByTestId("cell-0-1")).backgroundColor).not.toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-1-1")).backgroundColor).not.toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-2-1")).backgroundColor).not.toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-3-1")).backgroundColor).not.toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-4-1")).backgroundColor).not.toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-5-1")).backgroundColor).not.toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-6-1")).backgroundColor).not.toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-7-1")).backgroundColor).not.toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-8-1")).backgroundColor).not.toBe("rgb(163, 210, 202)");
    });

    // TODO:書く
    //   it("1マス目に指したら自動で成る", () => {
    //     // 未実装なので自動では成れない
    //   });

    it("自分の駒は取れない", () => {
      render(<Home />);

      movePiece([8, 3], [7, 3]);
      movePiece([7, 3], [6, 3]);

      expect(screen.getByTestId("piece-6-3").textContent).toBe("歩");
      expect(screen.getByTestId("piece-7-3").textContent).toBe("金");
    });

    it("選択可能なポジションが出ている時に他の駒をクリックしたら選択解除される", () => {
      render(<Home />);

      // 初期位置に駒があることを確認
      fireEvent.click(screen.getByTestId("piece-6-0"));

      // 移動可能位置が青い
      expect(window.getComputedStyle(screen.getByTestId("cell-5-0")).backgroundColor).toBe("rgb(163, 210, 202)");

      // 他の駒をクリック
      fireEvent.click(screen.getByTestId("piece-6-1"));
      expect(window.getComputedStyle(screen.getByTestId("cell-5-0")).backgroundColor).not.toBe("rgb(163, 210, 202)");
    });

    it("いきなり3段目の歩は取れない", () => {
      render(<Home />);

      const opponentPiece = screen.queryByTestId("piece-2-0");
      expect(opponentPiece).toBeInTheDocument();

      // いきなり3段目に移動しようとする
      movePiece([6, 0], [2, 0]);

      // 駒は取られず残ったままである
      expect(opponentPiece).toBeInTheDocument();
    });

    it("と金の移動可能な位置が正しい", async () => {
      render(<Home />);

      movePiece([6, 3], [5, 3]);
      movePiece([5, 3], [4, 3]);
      movePiece([4, 3], [3, 3]);
      window.confirm = vi.fn(() => true);
      movePiece([3, 3], [2, 3]);

      fireEvent.click(screen.getByTestId("cell-2-3"));

      expect(window.getComputedStyle(screen.getByTestId("cell-2-2")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-2-4")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-3-3")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-1-2")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-1-3")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-1-4")).backgroundColor).toBe("rgb(163, 210, 202)");
    });
  });

  describe("金", () => {
    it("移動可能な位置が正しい", async () => {
      render(<Home />);

      // 初期位置に駒があることを確認
      fireEvent.click(screen.getByTestId("piece-8-3"));

      // 移動可能位置が青い
      expect(window.getComputedStyle(screen.getByTestId("cell-7-2")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-7-3")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-7-4")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-8-4")).backgroundColor).toBe("rgb(163, 210, 202)");

      fireEvent.click(screen.getByTestId("cell-7-3"));
      fireEvent.click(screen.getByTestId("piece-7-3"));

      expect(window.getComputedStyle(screen.getByTestId("cell-7-2")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-7-4")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-8-3")).backgroundColor).toBe("rgb(163, 210, 202)");

      expect(window.getComputedStyle(screen.getByTestId("cell-6-2")).backgroundColor).toBe("rgb(240, 217, 181)");
      expect(window.getComputedStyle(screen.getByTestId("cell-6-3")).backgroundColor).toBe("rgb(240, 217, 181)");
      expect(window.getComputedStyle(screen.getByTestId("cell-6-4")).backgroundColor).toBe("rgb(240, 217, 181)");
    });
    // TODO:書く
    // it("成れない");
  });

  describe("銀", () => {
    it("移動可能な位置が正しい", async () => {
      render(<Home />);

      // 初期位置に駒があることを確認
      fireEvent.click(screen.getByTestId("piece-8-2"));

      // 移動可能位置が青い
      expect(window.getComputedStyle(screen.getByTestId("cell-7-1")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-7-2")).backgroundColor).toBe("rgb(163, 210, 202)");
      expect(window.getComputedStyle(screen.getByTestId("cell-7-3")).backgroundColor).toBe("rgb(163, 210, 202)");

      fireEvent.click(screen.getByTestId("cell-7-1"));
      fireEvent.click(screen.getByTestId("piece-7-1"));

      expect(window.getComputedStyle(screen.getByTestId("cell-8-2")).backgroundColor).toBe("rgb(163, 210, 202)");

      expect(window.getComputedStyle(screen.getByTestId("cell-6-2")).backgroundColor).toBe("rgb(240, 217, 181)");
      expect(window.getComputedStyle(screen.getByTestId("cell-6-3")).backgroundColor).toBe("rgb(240, 217, 181)");
      expect(window.getComputedStyle(screen.getByTestId("cell-6-4")).backgroundColor).toBe("rgb(240, 217, 181)");
    });
  });

  describe("香車", () => {
    it("移動可能な位置が正しい", async () => {
      render(<Home />);

      // 初期位置に駒があることを確認
      fireEvent.click(screen.getByTestId("piece-8-0"));

      // 移動可能位置が青い
      expect(window.getComputedStyle(screen.getByTestId("cell-7-0")).backgroundColor).toBe("rgb(163, 210, 202)");

      // fireEvent.click(screen.getByTestId("cell-7-0"));
      // fireEvent.click(screen.getByTestId("piece-7-0"));

      // expect(window.getComputedStyle(screen.getByTestId("cell-8-0")).backgroundColor).toBe("rgb(163, 210, 202)");
      // expect(window.getComputedStyle(screen.getByTestId("cell-8-2")).backgroundColor).toBe("rgb(163, 210, 202)");

      // expect(window.getComputedStyle(screen.getByTestId("cell-6-2")).backgroundColor).toBe("rgb(240, 217, 181)");
      // expect(window.getComputedStyle(screen.getByTestId("cell-6-3")).backgroundColor).toBe("rgb(240, 217, 181)");
      // expect(window.getComputedStyle(screen.getByTestId("cell-6-4")).backgroundColor).toBe("rgb(240, 217, 181)");
    });
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

      movePiece([2, 0], [4, 0]);

      expect(screen.queryByTestId("piece-2-0")).toBeInTheDocument();
      expect(screen.queryByTestId("piece-4-0")).not.toBeInTheDocument();
    });

    it("駒を取得したら盤上に追加される", async () => {
      render(<Home />);

      // 最初に駒台に駒はない
      expect(screen.queryByTestId("captured-piece-opponent")).toBeNull();

      // １マスずつ移動させる
      movePiece([2, 0], [3, 0]);
      movePiece([3, 0], [4, 0]);
      movePiece([4, 0], [5, 0]);
      movePiece([5, 0], [6, 0]);

      expect(screen.getByTestId("captured-piece-opponent")).toBeInTheDocument();
    });

    it("7マスより下にいる時に成れる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePiece([2, 0], [3, 0]);
      movePiece([3, 0], [4, 0]);
      movePiece([4, 0], [5, 0]);

      // 成るかの確認
      window.confirm = vi.fn(() => true);
      movePiece([5, 0], [6, 0]);

      const movedPiece = screen.getByTestId("piece-6-0");
      expect(movedPiece.textContent).not.toBe("歩");
      expect(movedPiece.textContent).toBe("と");
    });

    it("成ったり成らなかったりできる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePiece([2, 0], [3, 0]);
      movePiece([3, 0], [4, 0]);
      movePiece([4, 0], [5, 0]);

      // 成らない
      window.confirm = vi.fn(() => false);
      movePiece([5, 0], [6, 0]);

      const movedPiece = screen.getByTestId("piece-6-0");
      expect(movedPiece.textContent).toBe("歩");
      expect(movedPiece.textContent).not.toBe("と");

      // 成る
      window.confirm = vi.fn(() => true);
      movePiece([6, 0], [7, 0]);

      const promotedPiece = screen.getByTestId("piece-7-0");
      expect(promotedPiece.textContent).not.toBe("歩");
      expect(promotedPiece.textContent).toBe("と");
    });

    it("駒台の歩が打てる", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePiece([2, 0], [3, 0]);
      movePiece([3, 0], [4, 0]);
      movePiece([4, 0], [5, 0]);

      window.confirm = vi.fn(() => true);
      movePiece([5, 0], [6, 0]);

      // 駒台をクリックして移動
      fireEvent.click(screen.getByTestId("captured-piece-opponent"));
      fireEvent.click(screen.getByTestId("cell-0-0"));

      expect(screen.getByTestId("piece-0-0")).toBeInTheDocument();
    });

    it("駒台から歩を打つ時に二歩できない", () => {
      render(<Home />);

      // １マスずつ移動させる
      movePiece([2, 0], [3, 0]);
      movePiece([3, 0], [4, 0]);
      movePiece([4, 0], [5, 0]);

      window.confirm = vi.fn(() => false);
      movePiece([5, 0], [6, 0]);

      // 駒台をクリックして移動
      fireEvent.click(screen.getByTestId("captured-piece-opponent"));
      fireEvent.click(screen.getByTestId("cell-1-0"));

      expect(screen.queryByTestId("piece-1-0")).toBeNull();
    });

    // TODO:現状だと全てのコマを読んでしまうため、香車があるので8-0に置けずテストできない。そのため一時コメントアウトしてるので直す
    // it("進めなくなるので、駒台から１行目に打てない", () => {
    //   render(<Home />);

    //   // １マスずつ移動させる
    //   movePiece([2, 0], [3, 0]);
    //   movePiece([3, 0], [4, 0]);
    //   movePiece([4, 0], [5, 0]);

    //   window.confirm = vi.fn(() => true);
    //   movePiece([5, 0], [6, 0]);

    //   // 駒台をクリックして移動
    //   fireEvent.click(screen.getByTestId("captured-piece-opponent"));
    //   fireEvent.click(screen.getByTestId("cell-8-0"));

    //   expect(screen.queryByTestId("piece-8-0")).toBeNull();
    // });

    // TODO:書く
    //   it("1マス目に指したら自動で成る", () => {
    //     // 未実装なので自動では成れない
    //   });

    // TODO:書く
    //   it("自分の駒は取れない（多分未実装）", () => {
    //     //
    //   });

    // TODO:書く
    //   it("移動可能じゃないポジションをクリックしたら選択解除される（実装済）", () => {
    //     //
    //   });
  });
});

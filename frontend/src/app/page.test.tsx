import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("先手", () => {
  it("盤上の歩が1マス上に指せる", async () => {
    render(<Home />);

    // 初期位置に駒があることを確認
    const initialPiece = screen.getByTestId("piece-6-0");

    // セルの存在を確認
    const targetCell = screen.getByTestId("cell-5-0");

    // 初期位置のセルをクリック
    fireEvent.click(initialPiece);

    // 移動先のセルをクリック
    fireEvent.click(targetCell);

    // 駒が移動したことを確認
    expect(screen.queryByTestId("piece-6-0")).not.toBeInTheDocument();
    expect(screen.getByTestId("piece-5-0")).toBeInTheDocument();
  });

  it("盤上の歩が1マス以外に指そうとしたら移動できない", async () => {
    render(<Home />);

    const initialPiece = screen.getByTestId("piece-6-0");
    const targetCell = screen.getByTestId("cell-4-0");

    fireEvent.click(initialPiece);
    fireEvent.click(targetCell);

    expect(screen.queryByTestId("piece-6-0")).toBeInTheDocument();
  });

  //   it("盤上の歩がさせる位置が正しい", () => {
  //     //
  //   });

  //   it("駒を取得したら盤上に追加される", () => {
  //     //
  //   });

  //   it("駒台の歩が打てる位置が正しい", () => {
  //     //
  //   });

  //   it("駒台から歩を打つ時に二歩できない", () => {
  //     //
  //   });

  //   it("3マスより上にいる時に成れる", () => {
  //     //
  //   });

  //   it("成らないことも可能", () => {
  //     //
  //   });

  //   it("1マス目に指したら自動で成る", () => {
  //     //
  //   });
});

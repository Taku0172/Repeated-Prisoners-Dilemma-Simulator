import { describe, expect, test } from "vitest";

import {
    applyImplementationError
} from "./gameLogic.js";

describe("applyImplementationError", () => {
    test("エラー率0ならCはCのまま", () => {
        const result =
            applyImplementationError(
                "C",
                0,
                () => 0
            );

        expect(result).toEqual({
            intendedAction: "C",
            actualAction: "C",
            errorOccurred: false
        });
    });

    test("エラー率0ならDはDのまま", () => {
        const result =
            applyImplementationError(
                "D",
                0,
                () => 0
            );

        expect(result.actualAction).toBe("D");
        expect(result.errorOccurred).toBe(false);
    });

    test("エラーが起きるとCがDに反転する", () => {
        const result =
            applyImplementationError(
                "C",
                0.1,
                () => 0.05
            );

        expect(result.actualAction).toBe("D");
        expect(result.errorOccurred).toBe(true);
    });

    test("エラーが起きるとDがCに反転する", () => {
        const result =
            applyImplementationError(
                "D",
                0.1,
                () => 0.05
            );

        expect(result.actualAction).toBe("C");
        expect(result.errorOccurred).toBe(true);
    });

    test("乱数がエラー率以上なら反転しない", () => {
        const result =
            applyImplementationError(
                "C",
                0.1,
                () => 0.1
            );

        expect(result.actualAction).toBe("C");
        expect(result.errorOccurred).toBe(false);
    });

    test("エラー率1なら必ず反転する", () => {
        const result =
            applyImplementationError(
                "C",
                1,
                () => 0.999
            );

        expect(result.actualAction).toBe("D");
        expect(result.errorOccurred).toBe(true);
    });

    test("C・D以外の行動ならエラーになる", () => {
        expect(
            () =>
                applyImplementationError(
                    "X",
                    0.1
                )
        ).toThrow();
    });

    test("エラー率が範囲外ならエラーになる", () => {
        expect(
            () =>
                applyImplementationError(
                    "C",
                    -0.1
                )
        ).toThrow();

        expect(
            () =>
                applyImplementationError(
                    "C",
                    1.1
                )
        ).toThrow();
    });
});
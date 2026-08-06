import { describe, expect, test } from "vitest";

import {
    chooseTitForTatAction
} from "./strategies.js";

describe("chooseTitForTatAction", () => {
    test("初回は協力する", () => {
        expect(
            chooseTitForTatAction([])
        ).toBe("C");
    });

    test("相手の前回がCならCを選ぶ", () => {
        expect(
            chooseTitForTatAction(["D", "C"])
        ).toBe("C");
    });

    test("相手の前回がDならDを選ぶ", () => {
        expect(
            chooseTitForTatAction(["C", "D"])
        ).toBe("D");
    });

    test("履歴が配列でなければエラーになる", () => {
        expect(
            () => chooseTitForTatAction("C")
        ).toThrow();
    });

    test("履歴にC・D以外が含まれる場合はエラーになる", () => {
        expect(
            () => chooseTitForTatAction(["C", "X"])
        ).toThrow();
    });
});
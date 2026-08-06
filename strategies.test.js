import { describe, expect, test } from "vitest";

import {
    chooseTitForTatAction,
    chooseForgivingTitForTatAction,
    chooseGrimTriggerAction
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

describe("chooseForgivingTitForTatAction", () => {
    test("初回は協力する", () => {
        expect(
            chooseForgivingTitForTatAction([])
        ).toBe("C");
    });

    test("相手の前回がCならCを選ぶ", () => {
        expect(
            chooseForgivingTitForTatAction(["D", "C"])
        ).toBe("C");
    });

    test("相手の前回がDでも許す場合はCを選ぶ", () => {
        const alwaysForgiveRandom = () => 0.1;

        expect(
            chooseForgivingTitForTatAction(
                ["C", "D"],
                0.2,
                alwaysForgiveRandom
            )
        ).toBe("C");
    });

    test("相手の前回がDで許さない場合はDを選ぶ", () => {
        const neverForgiveRandom = () => 0.8;

        expect(
            chooseForgivingTitForTatAction(
                ["C", "D"],
                0.2,
                neverForgiveRandom
            )
        ).toBe("D");
    });

    test("許し率が0なら必ず報復する", () => {
        expect(
            chooseForgivingTitForTatAction(
                ["D"],
                0,
                () => 0
            )
        ).toBe("D");
    });

    test("許し率が1なら必ず許す", () => {
        expect(
            chooseForgivingTitForTatAction(
                ["D"],
                1,
                () => 0.999
            )
        ).toBe("C");
    });

    test("許し率が範囲外ならエラーになる", () => {
        expect(
            () =>
                chooseForgivingTitForTatAction(
                    ["D"],
                    -0.1
                )
        ).toThrow();

        expect(
            () =>
                chooseForgivingTitForTatAction(
                    ["D"],
                    1.1
                )
        ).toThrow();
    });
});

describe("chooseGrimTriggerAction", () => {
    test("初回は協力する", () => {
        expect(
            chooseGrimTriggerAction([])
        ).toBe("C");
    });

    test("相手が一度も裏切っていなければ協力する", () => {
        expect(
            chooseGrimTriggerAction([
                "C",
                "C",
                "C"
            ])
        ).toBe("C");
    });

    test("相手が前回裏切っていれば裏切る", () => {
        expect(
            chooseGrimTriggerAction([
                "C",
                "C",
                "D"
            ])
        ).toBe("D");
    });

    test("過去に一度でも裏切りがあれば裏切り続ける", () => {
        expect(
            chooseGrimTriggerAction([
                "C",
                "D",
                "C",
                "C"
            ])
        ).toBe("D");
    });

    test("履歴が配列でなければエラーになる", () => {
        expect(
            () => chooseGrimTriggerAction("C")
        ).toThrow();
    });

    test("履歴にC・D以外があればエラーになる", () => {
        expect(
            () =>
                chooseGrimTriggerAction([
                    "C",
                    "X"
                ])
        ).toThrow();
    });
});
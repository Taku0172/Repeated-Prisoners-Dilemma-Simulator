import { describe, expect, test } from "vitest";

import {
    chooseTitForTatAction,
    chooseForgivingTitForTatAction,
    chooseGrimTriggerAction,
    chooseWinStayLoseShiftAction,
    chooseRandomAction
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

describe("chooseWinStayLoseShiftAction", () => {
    test("初回は協力する", () => {
        expect(
            chooseWinStayLoseShiftAction(
                [],
                []
            )
        ).toBe("C");
    });

    test("前回Cで3点ならCを続ける", () => {
        expect(
            chooseWinStayLoseShiftAction(
                ["C"],
                [3]
            )
        ).toBe("C");
    });

    test("前回Dで5点ならDを続ける", () => {
        expect(
            chooseWinStayLoseShiftAction(
                ["D"],
                [5]
            )
        ).toBe("D");
    });

    test("前回Cで0点ならDに切り替える", () => {
        expect(
            chooseWinStayLoseShiftAction(
                ["C"],
                [0]
            )
        ).toBe("D");
    });

    test("前回Dで1点ならCに切り替える", () => {
        expect(
            chooseWinStayLoseShiftAction(
                ["D"],
                [1]
            )
        ).toBe("C");
    });

    test("行動履歴と利得履歴の長さが違えばエラーになる", () => {
        expect(
            () =>
                chooseWinStayLoseShiftAction(
                    ["C", "D"],
                    [3]
                )
        ).toThrow();
    });

    test("履歴にC・D以外が含まれればエラーになる", () => {
        expect(
            () =>
                chooseWinStayLoseShiftAction(
                    ["X"],
                    [3]
                )
        ).toThrow();
    });
});

describe("chooseRandomAction", () => {
    test("乱数が0.5未満ならCを選ぶ", () => {
        const lowRandom = () => 0.2;

        expect(
            chooseRandomAction(lowRandom)
        ).toBe("C");
    });

    test("乱数が0.5以上ならDを選ぶ", () => {
        const highRandom = () => 0.8;

        expect(
            chooseRandomAction(highRandom)
        ).toBe("D");
    });

    test("境界値0.5ならDを選ぶ", () => {
        const boundaryRandom = () => 0.5;

        expect(
            chooseRandomAction(boundaryRandom)
        ).toBe("D");
    });

    test("randomFnが関数でなければエラーになる", () => {
        expect(
            () => chooseRandomAction(0.2)
        ).toThrow();
    });
});
import { describe, expect, test } from "vitest";

import {
    applyImplementationError,
    playRound,
    simulateGame
} from "./gameLogic.js";

import {
    STRATEGIES
} from "./strategies.js";

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

describe("playRound", () => {
    test("TFT同士の初回は相互協力になる", () => {
        const result = playRound({
            strategyA: STRATEGIES.TIT_FOR_TAT,
            strategyB: STRATEGIES.TIT_FOR_TAT,
            errorRate: 0
        });

        expect(result.playerA.actualAction).toBe("C");
        expect(result.playerB.actualAction).toBe("C");
        expect(result.playerA.payoff).toBe(3);
        expect(result.playerB.payoff).toBe(3);
    });

    test("TFTは相手の前回のDを模倣する", () => {
        const result = playRound({
            strategyA: STRATEGIES.TIT_FOR_TAT,
            strategyB: STRATEGIES.TIT_FOR_TAT,
            historyA: ["C"],
            historyB: ["D"],
            payoffHistoryA: [0],
            payoffHistoryB: [5],
            errorRate: 0
        });

        expect(result.playerA.actualAction).toBe("D");
        expect(result.playerB.actualAction).toBe("C");
        expect(result.playerA.payoff).toBe(5);
        expect(result.playerB.payoff).toBe(0);
    });

    test("実装ミスが発生したか記録される", () => {
        const result = playRound({
            strategyA: STRATEGIES.TIT_FOR_TAT,
            strategyB: STRATEGIES.TIT_FOR_TAT,
            errorRate: 1,
            randomFn: () => 0
        });

        expect(result.playerA.intendedAction).toBe("C");
        expect(result.playerA.actualAction).toBe("D");
        expect(result.playerA.errorOccurred).toBe(true);

        expect(result.playerB.actualAction).toBe("D");
        expect(result.playerB.errorOccurred).toBe(true);
    });

    test("Grim Triggerは過去の裏切りを受けてDを選ぶ", () => {
        const result = playRound({
            strategyA: STRATEGIES.GRIM_TRIGGER,
            strategyB: STRATEGIES.TIT_FOR_TAT,
            historyA: ["C"],
            historyB: ["D"],
            payoffHistoryA: [0],
            payoffHistoryB: [5],
            errorRate: 0
        });

        expect(result.playerA.actualAction).toBe("D");
    });
});

describe("simulateGame", () => {
    test("指定したラウンド数だけ結果を保存する", () => {
        const result = simulateGame({
            strategyA: STRATEGIES.TIT_FOR_TAT,
            strategyB: STRATEGIES.TIT_FOR_TAT,
            rounds: 10,
            errorRate: 0
        });

        expect(result.historyA).toHaveLength(10);
        expect(result.historyB).toHaveLength(10);
        expect(result.payoffHistoryA).toHaveLength(10);
        expect(result.payoffHistoryB).toHaveLength(10);
        expect(result.roundHistory).toHaveLength(10);
    });

    test("ノイズなしのTFT同士は全ラウンドで協力する", () => {
        const result = simulateGame({
            strategyA: STRATEGIES.TIT_FOR_TAT,
            strategyB: STRATEGIES.TIT_FOR_TAT,
            rounds: 20,
            errorRate: 0
        });

        expect(
            result.historyA.every(
                action => action === "C"
            )
        ).toBe(true);

        expect(
            result.historyB.every(
                action => action === "C"
            )
        ).toBe(true);
    });

    test("ノイズなしのTFT同士は毎期3点を得る", () => {
        const result = simulateGame({
            strategyA: STRATEGIES.TIT_FOR_TAT,
            strategyB: STRATEGIES.TIT_FOR_TAT,
            rounds: 10,
            errorRate: 0
        });

        expect(result.payoffHistoryA).toEqual(
            Array(10).fill(3)
        );

        expect(result.payoffHistoryB).toEqual(
            Array(10).fill(3)
        );
    });

    test("各ラウンドにラウンド番号が記録される", () => {
        const result = simulateGame({
            strategyA: STRATEGIES.GRIM_TRIGGER,
            strategyB: STRATEGIES.TIT_FOR_TAT,
            rounds: 3,
            errorRate: 0
        });

        expect(
            result.roundHistory.map(
                item => item.round
            )
        ).toEqual([1, 2, 3]);
    });

    test("ラウンド数が0ならエラーになる", () => {
        expect(
            () =>
                simulateGame({
                    strategyA:
                        STRATEGIES.TIT_FOR_TAT,
                    strategyB:
                        STRATEGIES.TIT_FOR_TAT,
                    rounds: 0
                })
        ).toThrow();
    });
});

test("eventHistoryが返される", () => {

    const result = simulateGame({
        strategyA: STRATEGIES.TIT_FOR_TAT,
        strategyB: STRATEGIES.TIT_FOR_TAT,
        rounds: 5,
        errorRate: 0
    });

    expect(
        Array.isArray(
            result.eventHistory
        )
    ).toBe(true);

});

test("エラー率1ならイベントが記録される", () => {

    const result = simulateGame({
        strategyA: STRATEGIES.TIT_FOR_TAT,
        strategyB: STRATEGIES.TIT_FOR_TAT,
        rounds: 3,
        errorRate: 1,
        randomFn: () => 0
    });

    expect(
        result.eventHistory.length
    ).toBeGreaterThan(0);

});
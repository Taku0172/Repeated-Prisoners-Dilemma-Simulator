import { describe, expect, test } from "vitest";

import {
    createRoundEvents
} from "./eventLog.js";

describe("createRoundEvents", () => {
    test("Aの実装ミスを記録する", () => {
        const events = createRoundEvents({
            round: 3,
            strategyA: "TIT_FOR_TAT",
            strategyB: "TIT_FOR_TAT",
            historyA: ["C", "C", "D"],
            historyB: ["C", "C", "C"],
            roundResult: {
                playerA: {
                    intendedAction: "C",
                    actualAction: "D",
                    errorOccurred: true
                },
                playerB: {
                    intendedAction: "C",
                    actualAction: "C",
                    errorOccurred: false
                }
            }
        });

        expect(events).toHaveLength(1);
        expect(events[0].type).toBe(
            "IMPLEMENTATION_ERROR"
        );
        expect(events[0].player).toBe("A");
    });

    test("両者にミスがなければイベントは空", () => {
        const events = createRoundEvents({
            round: 1,
            strategyA: "TIT_FOR_TAT",
            strategyB: "TIT_FOR_TAT",
            historyA: ["C"],
            historyB: ["C"],
            roundResult: {
                playerA: {
                    intendedAction: "C",
                    actualAction: "C",
                    errorOccurred: false
                },
                playerB: {
                    intendedAction: "C",
                    actualAction: "C",
                    errorOccurred: false
                }
            }
        });

        expect(events).toEqual([]);
    });

    test("AのGrim Trigger発動を記録する", () => {
        const events = createRoundEvents({
            round: 4,
            strategyA: "GRIM_TRIGGER",
            strategyB: "TIT_FOR_TAT",
            historyA: ["C", "C", "C", "C"],
            historyB: ["C", "C", "C", "D"],
            roundResult: {
                playerA: {
                    intendedAction: "C",
                    actualAction: "C",
                    errorOccurred: false
                },
                playerB: {
                    intendedAction: "D",
                    actualAction: "D",
                    errorOccurred: false
                }
            }
        });

        expect(
            events.some(
                event =>
                    event.type ===
                    "GRIM_TRIGGER_ACTIVATED"
            )
        ).toBe(true);
    });

    test("過去にすでにDがあれば再発動扱いにしない", () => {
        const events = createRoundEvents({
            round: 5,
            strategyA: "GRIM_TRIGGER",
            strategyB: "TIT_FOR_TAT",
            historyA: ["C", "C", "D", "D", "D"],
            historyB: ["C", "D", "C", "C", "D"],
            roundResult: {
                playerA: {
                    intendedAction: "D",
                    actualAction: "D",
                    errorOccurred: false
                },
                playerB: {
                    intendedAction: "D",
                    actualAction: "D",
                    errorOccurred: false
                }
            }
        });

        expect(
            events.some(
                event =>
                    event.type ===
                    "GRIM_TRIGGER_ACTIVATED"
            )
        ).toBe(false);
    });

    test("ラウンド番号が不正ならエラーになる", () => {
        expect(
            () =>
                createRoundEvents({
                    round: 0,
                    strategyA: "TIT_FOR_TAT",
                    strategyB: "TIT_FOR_TAT",
                    historyA: [],
                    historyB: [],
                    roundResult: {
                        playerA: {},
                        playerB: {}
                    }
                })
        ).toThrow();
    });
});
import { describe, expect, test } from "vitest";
import { getPayoff } from "./payoff.js";

describe("getPayoff", () => {
    test("CとCなら両者3点", () => {
        expect(getPayoff("C", "C")).toEqual({
            playerA: 3,
            playerB: 3
        });
    });

    test("CとDならAは0点、Bは5点", () => {
        expect(getPayoff("C", "D")).toEqual({
            playerA: 0,
            playerB: 5
        });
    });

    test("DとCならAは5点、Bは0点", () => {
        expect(getPayoff("D", "C")).toEqual({
            playerA: 5,
            playerB: 0
        });
    });

    test("DとDなら両者1点", () => {
        expect(getPayoff("D", "D")).toEqual({
            playerA: 1,
            playerB: 1
        });
    });

    test("CまたはD以外ならエラーになる", () => {
        expect(() => getPayoff("X", "C")).toThrow();
        expect(() => getPayoff("C", "X")).toThrow();
    });
});
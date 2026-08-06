import { describe, expect, test } from "vitest";

import {
    calculateStatistics
} from "./statistics.js";

describe("calculateStatistics", () => {

    test("累積利得を正しく返す", () => {

        const result =
            calculateStatistics(
                [3,3,1],
                [3,3,1],
                ["C","C","D"],
                ["C","C","D"]
            );

        expect(
            result.totalPayoffA
        ).toBe(7);

        expect(
            result.totalPayoffB
        ).toBe(7);

    });

    test("平均利得を正しく返す", () => {

        const result =
            calculateStatistics(
                [3,3,1],
                [3,3,1],
                ["C","C","D"],
                ["C","C","D"]
            );

        expect(
            result.averagePayoffA
        ).toBeCloseTo(7/3);

    });

    test("協力率を正しく返す", () => {

        const result =
            calculateStatistics(
                [3,3,1],
                [3,3,1],
                ["C","C","D"],
                ["C","D","D"]
            );

        expect(
            result.cooperationRateA
        ).toBeCloseTo(2/3);

        expect(
            result.cooperationRateB
        ).toBeCloseTo(1/3);

    });

    test("履歴長が違えばエラー", () => {

        expect(()=>
            calculateStatistics(
                [3],
                [3,3],
                ["C"],
                ["C"]
            )
        ).toThrow();

    });

});
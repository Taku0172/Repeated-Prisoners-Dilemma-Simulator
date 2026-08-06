import { getPayoff } from "./payoff.js";

import {
    chooseStrategyAction
} from "./strategies.js";

export function applyImplementationError(
    intendedAction,
    errorRate,
    randomFn = Math.random
) {
    if (
        intendedAction !== "C" &&
        intendedAction !== "D"
    ) {
        throw new Error(
            "intendedAction must be C or D."
        );
    }

    if (
        typeof errorRate !== "number" ||
        !Number.isFinite(errorRate) ||
        errorRate < 0 ||
        errorRate > 1
    ) {
        throw new Error(
            "errorRate must be between 0 and 1."
        );
    }

    if (typeof randomFn !== "function") {
        throw new Error(
            "randomFn must be a function."
        );
    }

    const errorOccurred =
        randomFn() < errorRate;

    const actualAction = errorOccurred
        ? intendedAction === "C"
            ? "D"
            : "C"
        : intendedAction;

    return {
        intendedAction,
        actualAction,
        errorOccurred
    };
}

export function playRound({
    strategyA,
    strategyB,
    historyA = [],
    historyB = [],
    payoffHistoryA = [],
    payoffHistoryB = [],
    errorRate = 0,
    forgivenessRate = 0.2,
    randomFn = Math.random
}) {
    if (!Array.isArray(historyA) || !Array.isArray(historyB)) {
        throw new Error("Action histories must be arrays.");
    }

    if (
        !Array.isArray(payoffHistoryA) ||
        !Array.isArray(payoffHistoryB)
    ) {
        throw new Error("Payoff histories must be arrays.");
    }

    const intendedActionA = chooseStrategyAction({
        strategy: strategyA,
        ownHistory: historyA,
        opponentHistory: historyB,
        ownPayoffHistory: payoffHistoryA,
        forgivenessRate,
        randomFn
    });

    const intendedActionB = chooseStrategyAction({
        strategy: strategyB,
        ownHistory: historyB,
        opponentHistory: historyA,
        ownPayoffHistory: payoffHistoryB,
        forgivenessRate,
        randomFn
    });

    const actionResultA = applyImplementationError(
        intendedActionA,
        errorRate,
        randomFn
    );

    const actionResultB = applyImplementationError(
        intendedActionB,
        errorRate,
        randomFn
    );

    const payoff = getPayoff(
        actionResultA.actualAction,
        actionResultB.actualAction
    );

    return {
        playerA: {
            intendedAction: intendedActionA,
            actualAction: actionResultA.actualAction,
            errorOccurred: actionResultA.errorOccurred,
            payoff: payoff.playerA
        },
        playerB: {
            intendedAction: intendedActionB,
            actualAction: actionResultB.actualAction,
            errorOccurred: actionResultB.errorOccurred,
            payoff: payoff.playerB
        }
    };
}

export function simulateGame({
    strategyA,
    strategyB,
    rounds = 100,
    errorRate = 0,
    forgivenessRate = 0.2,
    randomFn = Math.random
}) {
    if (!Number.isInteger(rounds) || rounds < 1) {
        throw new Error(
            "rounds must be a positive integer."
        );
    }

    const historyA = [];
    const historyB = [];
    const payoffHistoryA = [];
    const payoffHistoryB = [];
    const roundHistory = [];

    for (let round = 1; round <= rounds; round++) {
        const result = playRound({
            strategyA,
            strategyB,
            historyA,
            historyB,
            payoffHistoryA,
            payoffHistoryB,
            errorRate,
            forgivenessRate,
            randomFn
        });

        historyA.push(
            result.playerA.actualAction
        );

        historyB.push(
            result.playerB.actualAction
        );

        payoffHistoryA.push(
            result.playerA.payoff
        );

        payoffHistoryB.push(
            result.playerB.payoff
        );

        roundHistory.push({
            round,
            playerA: result.playerA,
            playerB: result.playerB
        });
    }

    return {
        strategyA,
        strategyB,
        rounds,
        historyA,
        historyB,
        payoffHistoryA,
        payoffHistoryB,
        roundHistory
    };
}
export function chooseTitForTatAction(opponentHistory) {
    if (!Array.isArray(opponentHistory)) {
        throw new Error("opponentHistory must be an array.");
    }

    if (opponentHistory.length === 0) {
        return "C";
    }

    const lastOpponentAction =
        opponentHistory[opponentHistory.length - 1];

    if (
        lastOpponentAction !== "C" &&
        lastOpponentAction !== "D"
    ) {
        throw new Error(
            "Opponent actions must be C or D."
        );
    }

    return lastOpponentAction;
}

export function chooseForgivingTitForTatAction(
    opponentHistory,
    forgivenessRate = 0.2,
    randomFn = Math.random
) {
    if (!Array.isArray(opponentHistory)) {
        throw new Error("opponentHistory must be an array.");
    }

    if (
        typeof forgivenessRate !== "number" ||
        forgivenessRate < 0 ||
        forgivenessRate > 1
    ) {
        throw new Error(
            "forgivenessRate must be between 0 and 1."
        );
    }

    if (typeof randomFn !== "function") {
        throw new Error("randomFn must be a function.");
    }

    if (opponentHistory.length === 0) {
        return "C";
    }

    const lastOpponentAction =
        opponentHistory[opponentHistory.length - 1];

    if (
        lastOpponentAction !== "C" &&
        lastOpponentAction !== "D"
    ) {
        throw new Error(
            "Opponent actions must be C or D."
        );
    }

    if (lastOpponentAction === "C") {
        return "C";
    }

    return randomFn() < forgivenessRate
        ? "C"
        : "D";
}

export function chooseGrimTriggerAction(
    opponentHistory
) {
    if (!Array.isArray(opponentHistory)) {
        throw new Error(
            "opponentHistory must be an array."
        );
    }

    const hasInvalidAction =
        opponentHistory.some(
            action =>
                action !== "C" &&
                action !== "D"
        );

    if (hasInvalidAction) {
        throw new Error(
            "Opponent actions must be C or D."
        );
    }

    const hasOpponentDefected =
        opponentHistory.includes("D");

    return hasOpponentDefected
        ? "D"
        : "C";
}

export function chooseWinStayLoseShiftAction(
    ownHistory,
    ownPayoffHistory
) {
    if (!Array.isArray(ownHistory)) {
        throw new Error(
            "ownHistory must be an array."
        );
    }

    if (!Array.isArray(ownPayoffHistory)) {
        throw new Error(
            "ownPayoffHistory must be an array."
        );
    }

    if (
        ownHistory.length !==
        ownPayoffHistory.length
    ) {
        throw new Error(
            "History lengths must match."
        );
    }

    const hasInvalidAction =
        ownHistory.some(
            action =>
                action !== "C" &&
                action !== "D"
        );

    if (hasInvalidAction) {
        throw new Error(
            "Actions must be C or D."
        );
    }

    const hasInvalidPayoff =
        ownPayoffHistory.some(
            payoff =>
                typeof payoff !== "number" ||
                !Number.isFinite(payoff)
        );

    if (hasInvalidPayoff) {
        throw new Error(
            "Payoffs must be finite numbers."
        );
    }

    if (ownHistory.length === 0) {
        return "C";
    }

    const lastAction =
        ownHistory[ownHistory.length - 1];

    const lastPayoff =
        ownPayoffHistory[
            ownPayoffHistory.length - 1
        ];

    const isWin =
        lastPayoff === 3 ||
        lastPayoff === 5;

    if (isWin) {
        return lastAction;
    }

    return lastAction === "C"
        ? "D"
        : "C";
}

export function chooseRandomAction(
    randomFn = Math.random
) {
    if (typeof randomFn !== "function") {
        throw new Error(
            "randomFn must be a function."
        );
    }

    return randomFn() < 0.5
        ? "C"
        : "D";
}
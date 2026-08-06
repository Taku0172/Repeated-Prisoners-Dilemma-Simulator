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
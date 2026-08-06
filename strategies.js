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
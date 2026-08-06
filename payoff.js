export function getPayoff(actionA, actionB) {
    const validActions = ["C", "D"];

    if (
        !validActions.includes(actionA) ||
        !validActions.includes(actionB)
    ) {
        throw new Error("Actions must be C or D.");
    }

    if (actionA === "C" && actionB === "C") {
        return {
            playerA: 3,
            playerB: 3
        };
    }

    if (actionA === "C" && actionB === "D") {
        return {
            playerA: 0,
            playerB: 5
        };
    }

    if (actionA === "D" && actionB === "C") {
        return {
            playerA: 5,
            playerB: 0
        };
    }

    return {
        playerA: 1,
        playerB: 1
    };
}
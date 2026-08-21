export function createRoundEvents({
    round,
    strategyA,
    strategyB,
    historyA,
    historyB,
    roundResult
}) {
    if (!Number.isInteger(round) || round < 1) {
        throw new Error(
            "round must be a positive integer."
        );
    }

    if (!roundResult?.playerA || !roundResult?.playerB) {
        throw new Error(
            "roundResult must contain playerA and playerB."
        );
    }

    const events = [];

    if (roundResult.playerA.errorOccurred) {
        events.push({
            round,
            type: "IMPLEMENTATION_ERROR",
            player: "A",
            message:
                `Player Aが実装ミスにより、` +
                `${roundResult.playerA.intendedAction}ではなく` +
                `${roundResult.playerA.actualAction}を選択しました。`
        });
    }

    if (roundResult.playerB.errorOccurred) {
        events.push({
            round,
            type: "IMPLEMENTATION_ERROR",
            player: "B",
            message:
                `Player Bが実装ミスにより、` +
                `${roundResult.playerB.intendedAction}ではなく` +
                `${roundResult.playerB.actualAction}を選択しました。`
        });
    }

    const grimWasInactiveForA =
        strategyA === "GRIM_TRIGGER" &&
        !historyB.slice(0, -1).includes("D");

    const grimActivatedForA =
        grimWasInactiveForA &&
        historyB.at(-1) === "D";

    if (grimActivatedForA) {
        events.push({
            round,
            type: "GRIM_TRIGGER_ACTIVATED",
            player: "A",
            message:
                "Player AのGrim Triggerが発動しました。"
        });
    }

    const grimWasInactiveForB =
        strategyB === "GRIM_TRIGGER" &&
        !historyA.slice(0, -1).includes("D");

    const grimActivatedForB =
        grimWasInactiveForB &&
        historyA.at(-1) === "D";

    if (grimActivatedForB) {
        events.push({
            round,
            type: "GRIM_TRIGGER_ACTIVATED",
            player: "B",
            message:
                "Player BのGrim Triggerが発動しました。"
        });
    }

const hasPreviousRound =
    historyA.length >= 2 &&
    historyB.length >= 2;

if (hasPreviousRound) {
    const previousActionA =
        historyA[historyA.length - 2];

    const previousActionB =
        historyB[historyB.length - 2];

    const currentActionA =
        historyA[historyA.length - 1];

    const currentActionB =
        historyB[historyB.length - 1];

    const previousMutualCooperation =
        previousActionA === "C" &&
        previousActionB === "C";

    const currentMutualCooperation =
        currentActionA === "C" &&
        currentActionB === "C";

    if (
        previousMutualCooperation &&
        !currentMutualCooperation
    ) {
        events.push({
            round,
            type: "COOPERATION_BREAKDOWN",
            player: null,
            message:
                "相互協力が崩れました。"
        });
    }

    if (
        !previousMutualCooperation &&
        currentMutualCooperation
    ) {
        events.push({
            round,
            type: "COOPERATION_RECOVERY",
            player: null,
            message:
                "相互協力が回復しました。"
        });
    }
}
return events;
}
export function calculateStatistics(
    payoffHistoryA,
    payoffHistoryB,
    historyA,
    historyB
) {
    if (
        payoffHistoryA.length !==
        payoffHistoryB.length
    ) {
        throw new Error(
            "Payoff histories must have the same length."
        );
    }

    if (
        historyA.length !==
        historyB.length
    ) {
        throw new Error(
            "Action histories must have the same length."
        );
    }

    const totalPayoffA =
        payoffHistoryA.reduce(
            (sum, payoff) => sum + payoff,
            0
        );

    const totalPayoffB =
        payoffHistoryB.reduce(
            (sum, payoff) => sum + payoff,
            0
        );

    const cooperationRateA =
        historyA.filter(
            action => action === "C"
        ).length / historyA.length;

    const cooperationRateB =
        historyB.filter(
            action => action === "C"
        ).length / historyB.length;

    return {
        totalPayoffA,
        totalPayoffB,

        averagePayoffA:
            totalPayoffA /
            payoffHistoryA.length,

        averagePayoffB:
            totalPayoffB /
            payoffHistoryB.length,

        cooperationRateA,
        cooperationRateB
    };
}
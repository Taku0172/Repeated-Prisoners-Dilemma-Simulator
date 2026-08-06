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
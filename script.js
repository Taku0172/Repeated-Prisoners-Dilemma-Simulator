import { simulateGame } from "./gameLogic.js";

import { calculateStatistics } from "./statistics.js";

const runButton =
    document.getElementById("runButton");

const strategyASelect =
    document.getElementById("strategyA");

const strategyBSelect =
    document.getElementById("strategyB");

const roundsInput =
    document.getElementById("rounds");

const errorRateInput =
    document.getElementById("errorRate");

const statisticsDiv =
    document.getElementById("statistics");

runButton.addEventListener(
    "click",
    () => {

        const result = simulateGame({

            strategyA:
                strategyASelect.value,

            strategyB:
                strategyBSelect.value,

            rounds:
                Number(roundsInput.value),

            errorRate:
                Number(errorRateInput.value)

        });

        const stats =
            calculateStatistics(

                result.payoffHistoryA,

                result.payoffHistoryB,

                result.historyA,

                result.historyB

            );

        statisticsDiv.innerHTML = `
            <p>
                Player A 平均利得：
                ${stats.averagePayoffA.toFixed(2)}
            </p>

            <p>
                Player B 平均利得：
                ${stats.averagePayoffB.toFixed(2)}
            </p>

            <p>
                Player A 協力率：
                ${(stats.cooperationRateA*100).toFixed(1)}%
            </p>

            <p>
                Player B 協力率：
                ${(stats.cooperationRateB*100).toFixed(1)}%
            </p>
        `;

    }
);

console.log(
    "Repeated Prisoner's Dilemma Simulator"
);
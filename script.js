import { createRoundEvents } from "./eventLog.js";

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

const payoffChartCanvas = 
    document.getElementById("payoffChart");

const eventLogDiv =
    document.getElementById("eventLog");

let payoffChart = null;

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
        const labels =
            result.payoffHistoryA.map(
                (_, index) => index + 1
            );

        let cumulativeA = 0;
        let cumulativeB = 0;

        const cumulativePayoffA =
            result.payoffHistoryA.map(payoff => {
                cumulativeA += payoff;
                return cumulativeA;
            });

        const cumulativePayoffB =
            result.payoffHistoryB.map(payoff => {
                cumulativeB += payoff;
                return cumulativeB;
            });

        if (payoffChart !== null) {
            payoffChart.destroy();
        }

        payoffChart = new Chart(
            payoffChartCanvas,
            {
                type: "line",

                data: {
                    labels: labels,

                    datasets: [
                        {
                            label: "Player A 累積利得",
                            data: cumulativePayoffA,
                            borderWidth: 2,
                            pointRadius: 0
                        },

                        {
                            label: "Player B 累積利得",
                            data: cumulativePayoffB,
                            borderWidth: 2,
                            pointRadius: 0
                        }
                    ]
                },

                options: {
                    responsive: true,

                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Round"
                            }
                        },

                        y: {
                            beginAtZero: true,

                            title: {
                                display: true,
                                text: "Cumulative Payoff"
                            }
                        }
                    }
                }
            }
        );
        if (result.eventHistory.length === 0) {
            eventLogDiv.innerHTML = `
                <p class="placeholder-text">
                    重要なイベントは発生しませんでした。
                </p>
            `;
        } else {
            eventLogDiv.innerHTML =
                result.eventHistory
                    .map(event => {

                        let eventLabel = "Event";

                        if (event.type === "IMPLEMENTATION_ERROR") {
                            eventLabel = "実装ミス";
                        }

                        if (event.type === "GRIM_TRIGGER_ACTIVATED") {
                            eventLabel = "Grim Trigger 発動";
                        }

                        return `
                            <div class="event-item ${event.type}">

                                <div class="event-header">
                                    <strong>
                                        Round ${event.round}
                                    </strong>

                                    <span class="event-label">
                                        ${eventLabel}
                                    </span>
                                </div>

                                <p>
                                    ${event.message}
                                </p>

                            </div>
                        `;
                    })
                    .join("");
                    join("");
        }

    }
);

console.log(
    "Repeated Prisoner's Dilemma Simulator"
);
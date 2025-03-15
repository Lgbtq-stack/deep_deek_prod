import {loadReferrals} from "./Referrals.js";

export function updateReferralChart(chartInfo) {
    const ctx = document.getElementById('referralChart')?.getContext('2d');

    if (!ctx) {
        console.error("❌ referralChart not found in DOM!");
        return;
    }

    if (window.referralChart instanceof Chart) {
        window.referralChart.destroy();
    }

    const sortedDates = Object.keys(chartInfo).sort();
    const labels = sortedDates.map(date => formatDate(date));
    const data = sortedDates.map(date => chartInfo[date] ?? 0);

    console.log("📊 Labels:", labels);
    console.log("📈 Data:", data);

    const maxDataValue = Math.max(...data);
    const yAxisMax = maxDataValue === 0 ? 10 : getYAxisMax(maxDataValue);
    const stepSize = getYAxisStep(maxDataValue);

    window.referralChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Bonuses Growth',
                data: data,
                borderColor: '#47a14c',
                borderWidth: 3,
                pointBackgroundColor: '#47a14c',
                pointRadius: 6,
                showLine: true,
                spanGaps: false,
                fill: true,
                backgroundColor: 'rgba(111, 207, 151, 0.2)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 0
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: yAxisMax,
                    ticks: {
                        stepSize: stepSize,
                        color: '#E0E0E0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: {
                    ticks: {
                        color: '#E0E0E0'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#FFFFFF'
                    }
                }
            }
        }
    });

    console.log("✅ Chart updated with light colors!");
}

function formatDate(dateStr) {
    let date = new Date(dateStr);
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
}

function getYAxisStep(totalBalance) {
    if (totalBalance <= 10) return 1;
    if (totalBalance <= 100) return 10;
    if (totalBalance <= 1000) return 100;
    if (totalBalance <= 10000) return 1000;
    return 5000;
}

function getYAxisMax(totalBalance) {
    let step = getYAxisStep(totalBalance);
    return Math.ceil(totalBalance / step) * step;
}

export async function initReferralChart() {
    console.log("📊 Init initReferralChart...");
    let referralData = await loadReferrals();

    if (!referralData || !referralData.chart_info) {
        console.error("❌ No data for chart!");
        return;
    }

    updateReferralChart(referralData.chart_info);
}

window.initReferralChart = initReferralChart;

import {user_Id} from "./GetUserID.js";

export async function fetchAndRenderStatistics() {
    try {
        google.charts.load('current', {'packages':['corechart']});

        const response = await fetch(`https://miniappservbb.com/api/user/statistic?uid=${user_Id}`);
        const data = await response.json();

        const balance = data.balance;
        const betsInfo = data.bets_info;

        google.charts.setOnLoadCallback(() => drawBalanceChart(balance));
        google.charts.setOnLoadCallback(() => drawBetsChart(betsInfo));
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

function drawBalanceChart(balance) {
    const rawData = [
        { label: 'Top Up \n', value: balance.top_up },
        { label: 'Referral \n', value: balance.referral },
        { label: 'Bets \n', value: balance.bets }
    ];

    const dataArray = [['Type', 'Amount']];

    const totalRaw = rawData.reduce((acc, item) => acc + item.value, 0);
    const total = totalRaw || 1;

    rawData.forEach(item => {
        let displayValue = item.value;
        if (item.value === 0) {
            displayValue = 0.000001; // почти не видно в диаграмме
        }
        const percent = ((item.value / total) * 100).toFixed(1);
        dataArray.push([`${item.label} (${percent}%)`, displayValue]);
    });

    const data = google.visualization.arrayToDataTable(dataArray);

    const options = {
        pieHole: 0.4,
        is3D: true,
        sliceVisibilityThreshold: 0,
        pieSliceText: 'percentage',
        pieSliceTextStyle: {
            color: '#fff',
            fontSize: 18,
            bold: true
        },
        colors: ['#42a5f5', '#ffa726', '#66bb6a'],
        chartArea: { width: '90%', height: '90%' },
        legend: { position: 'right', textStyle: { color: '#ccc', fontSize: 14 } },
        backgroundColor: { fill: 'transparent' },
        title: '',
    };

    const chart = new google.visualization.PieChart(document.getElementById('balanceChart'));
    chart.draw(data, options);
}

function drawBetsChart(betsInfo) {
    const total = betsInfo.win_total + betsInfo.lose_total;
    const winPercent = ((betsInfo.win_total / total) * 100).toFixed(1);
    const losePercent = ((betsInfo.lose_total / total) * 100).toFixed(1);

    const data = google.visualization.arrayToDataTable([
        ['Result', 'Count'],
        [`Wins \n (${winPercent}%)`, betsInfo.win_total],
        [`Loses \n (${losePercent}%)`, betsInfo.lose_total]
    ]);

    const options = {
        pieHole: 0.4,
        is3D: true,
        pieSliceText: 'percentage',
        pieSliceTextStyle: {
            color: '#fff',
            fontSize: 18,
            bold: true
        },
        colors: ['#8bc34a', '#f44336'],
        chartArea: {
            width: '90%',
            height: '90%'
        },
        legend: {
            position: 'right',
            textStyle: {
                color: '#ccc',
                fontSize: 14,
            }
        },
        backgroundColor: { fill: 'transparent' },
        title: '',
    };

    const chart = new google.visualization.PieChart(document.getElementById('betsChart'));
    chart.draw(data, options);
}

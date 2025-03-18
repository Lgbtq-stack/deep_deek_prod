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
    const data = google.visualization.arrayToDataTable([
        ['Type', 'Amount'],
        ['Top Up', balance.top_up],
        ['Referral', balance.referral],
        ['Bets', balance.bets]
    ]);

    const options = {
        pieHole: 1,
        is3D: true,
        pieSliceText: 'percentage',
        pieSliceTextStyle: {
            color: '#fff',
            fontSize: 16,
        },
        colors: ['#42a5f5', '#ffa726'],
        chartArea: {
            width: '90%',
            height: '90%'
        },
        legend: { position: 'bottom', textStyle: { color: '#ccc',fontSize: 16 } },
        backgroundColor: { fill: 'transparent' },
        title: '',
    };

    const chart = new google.visualization.PieChart(document.getElementById('balanceChart'));
    chart.draw(data, options);
}

function drawBetsChart(betsInfo) {
    const data = google.visualization.arrayToDataTable([
        ['Result', 'Count'],
        ['Wins', betsInfo.win_total],
        ['Loses', betsInfo.lose_total]
    ]);

    const options = {
        pieHole: 1,
        is3D: true,
        pieSliceText: 'percentage',
        pieSliceTextStyle: {
            color: '#fff',
            fontSize: 16,
        },
        colors: ['#8bc34a', '#f44336'],
        chartArea: {
            width: '90%',
            height: '90%'
        },
        legend: { position: 'bottom', textStyle: { color: '#ccc',fontSize: 16  }},
        backgroundColor: { fill: 'transparent' },
        title: '',
    };

    const chart = new google.visualization.PieChart(document.getElementById('betsChart'));
    chart.draw(data, options);
}

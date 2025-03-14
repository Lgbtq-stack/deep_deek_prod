const transactionsList = document.getElementById("transaction-list");
const activeTimers = new Map();
const cachedTransactions = new Map();

export function updateTransactionsUI(bets) {
    if (!transactionsList) {
        console.error("❌ Transactions list container not found.");
        return;
    }

    const newTransactionIds = new Set();

    bets.forEach(bet => {
        if (!bet.id || !bet.amount || !bet.start_price || !bet.expires_at) {
            console.error("⚠️ Data error:", bet);
            return;
        }

        const transactionId = bet.id;
        newTransactionIds.add(transactionId);

        const betAmount = parseFloat(bet.amount) || 0;
        const startPrice = parseFloat(bet.start_price) || 0;
        const tokensBought = bet.tokens_count ? parseFloat(bet.tokens_count) : 0;
        const isWin = bet.bet_profit > bet.amount;
        const profitLossText = `$${bet.bet_profit.toFixed(7)}`;
        const endTime = Date.parse(bet.expires_at);

        if (isNaN(endTime)) {
            console.error(`❌ ExpireTime error ${transactionId}:`, bet.expires_at);
            return;
        }

        if (cachedTransactions.has(transactionId)) {
            const existingTransaction = cachedTransactions.get(transactionId);

            existingTransaction.classList.toggle("win", isWin);
            existingTransaction.classList.toggle("lose", !isWin);

            const resultElement = existingTransaction.querySelector(".tx-result");
            resultElement.innerHTML = isWin
                ? `🏆 <strong>Winnings:</strong> ${profitLossText}`
                : `🏆 <strong>Loss:</strong> ${profitLossText}`;

            resultElement.classList.toggle("win", isWin);
            resultElement.classList.toggle("lose", !isWin);

            startCountdownTimer(endTime, existingTransaction.querySelector(".timer-value"), transactionId);
            return;
        }

        const transactionItem = document.createElement("div");
        transactionItem.classList.add("transaction-item", isWin ? "win" : "lose");
        transactionItem.dataset.transactionId = transactionId;

        const transactionContent = document.createElement("div");
        transactionContent.classList.add("transaction-content");

        const dataFields = [
            { key: "📈 Token:", value: bet.symbol || "Unknown" },
            { key: "💰 Bet Amount:", value: `$${betAmount.toFixed(7)}` },
            { key: "💰 Tokens Bought:", value: tokensBought.toFixed(2) },
            { key: "⏳ Time Left:", value: "Calculating...", class: "timer-value" },
            { key: "📊 Start Price:", value: `$${startPrice.toFixed(7)}` }
        ];

        const dataContainer = document.createElement("div");
        dataContainer.className = "transaction-data";

        dataFields.forEach(({ key, value, class: valueClass }, index) => {
            const row = document.createElement("div");
            row.className = "transaction-row";

            const keyElement = document.createElement("p");
            keyElement.className = "transaction-key";
            keyElement.innerHTML = `<strong>${key}</strong>`;

            const valueElement = document.createElement("p");
            valueElement.className = "transaction-value";
            valueElement.innerText = value;

            if (valueClass) {
                valueElement.classList.add(valueClass);
            }

            row.appendChild(keyElement);
            row.appendChild(valueElement);
            dataContainer.appendChild(row);

            if (index < dataFields.length - 1) {
                const separator = document.createElement("div");
                separator.className = "transaction-separator";
                dataContainer.appendChild(separator);
            }
        });

        transactionContent.appendChild(dataContainer);

        const resultElement = document.createElement("p");
        resultElement.className = `tx-result ${isWin ? "win" : "lose"}`;
        resultElement.innerHTML = isWin
            ? `🏆 <strong>Winnings:</strong> ${profitLossText}`
            : `🏆 <strong>Loss:</strong> ${profitLossText}`;

        transactionItem.appendChild(transactionContent);
        transactionItem.appendChild(resultElement);
        transactionsList.appendChild(transactionItem);

        cachedTransactions.set(transactionId, transactionItem);
        startCountdownTimer(endTime, transactionContent.querySelector(".timer-value"), transactionId);
    });

    cachedTransactions.forEach((transaction, transactionId) => {
        if (!newTransactionIds.has(transactionId)) {
            transaction.remove();
            cachedTransactions.delete(transactionId);
        }
    });
}

function startCountdownTimer(endTime, timerElement, betId) {
    if (!endTime || isNaN(endTime)) {
        console.error(`❌ Time error ${betId}:`, endTime);
        timerElement.innerHTML = `Invalid Time`;
        return;
    }

    if (activeTimers.has(betId)) {
        clearInterval(activeTimers.get(betId));
        activeTimers.delete(betId);
    }

    function updateTimer() {
        const nowUTC = Date.now();
        const timeLeft = Math.max(0, Math.floor((endTime - nowUTC) / 1000));

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / 86400);
            const hours = Math.floor((timeLeft % 86400) / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;

            let timeString = days > 0 ? `${days}d ${hours}h ${minutes}m ${seconds}s` :
                hours > 0 ? `${hours}h ${minutes}m ${seconds}s` :
                    minutes > 0 ? `${minutes}m ${seconds}s` :
                        `${seconds}s`;

            timerElement.innerHTML = timeString;
        } else {
            timerElement.innerHTML = `Expired`;
            clearInterval(activeTimers.get(betId));
            activeTimers.delete(betId);
        }
    }

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    activeTimers.set(betId, intervalId);
}

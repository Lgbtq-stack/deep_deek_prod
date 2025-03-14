import {showErrorPopup_} from "../Modular/Popups/PopupController.js";
import {user_Id} from "./GetUserID.js";

let currentPage = 1;
const countPerPage = 30;
let isLoading = false;
let totalPages = Infinity;
const historySection = document.querySelector('.history-section');
historySection.innerHTML = '';

const historyTitle = document.createElement('h2');
historyTitle.className = 'history-title';
historyTitle.innerText = 'History';
historySection.appendChild(historyTitle);

const historyList = document.createElement('div');
historyList.className = 'history-list';
historySection.appendChild(historyList);

export async function loadHistory(page = 1) {
    if (isLoading || page > totalPages) return;
    isLoading = true;

    try {
        const response = await fetch(`https://miniappservbb.com/api/bets/history?uid=${user_Id}&page=${page}&count=${countPerPage}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const historyData = await response.json();

        if (!historyData || !historyData.data || !Array.isArray(historyData.data)) {
            console.error("⚠️ Undefined data:", historyData);
            return;
        }

        totalPages = historyData.paging?.total_pages || Infinity;

        console.log(historyData.data);
        historyData.data.forEach(entry => {
            if (!entry.symbol || !entry.startPrice || !entry.endPrice || !entry.expiresAt || !entry.createdAt || !entry.amount) {
                console.error("⚠️ Histroy data error:", entry);
                return;
            }

            const betAmount = parseFloat(entry.amount) || 0;
            const tokensBought = parseFloat(entry.amountTokens) || 0;
            const profitAmount = parseFloat(entry.amountProfit) || 0;
            const totalAmount = betAmount + profitAmount;

            const isWin = entry.status === "WIN";
            const isLose = entry.status === "LOSE";
            const isBreakEven = profitAmount === 0;

            let profitLossText, profitLossColor;

            if (isBreakEven) {
                profitLossText = `⚪ <strong>Break-even:</strong> $${betAmount.toFixed(2)}`;
                profitLossColor = "#ffffff";
            } else if (isLose) {
                profitLossText = `🏆 <strong>Lose:</strong> $${totalAmount.toFixed(2)} (-$${Math.abs(profitAmount).toFixed(7)})`;
                profitLossColor = "#c33636";
            } else if (isWin) {
                profitLossText = `🏆 <strong>Win:</strong> $${totalAmount.toFixed(2)} (+$${profitAmount.toFixed(7)})`;
                profitLossColor = "#36c345";
            }

            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${isWin ? 'win' : isLose ? 'lose' : 'even'}`;

            historyItem.style.boxShadow = isWin
                ? "0 0 15px #36c345"
                : isLose
                    ? "0 0 15px #c33636"
                    : "0 0 15px #ffffff";

            const historyContent = document.createElement('div');
            historyContent.className = 'history-content';

            const betTypeText = entry.betType === "Up"
                ? "📈 <span style='color: #36c345; font-weight: bold;'>Bullish ⬆️</span>"
                : "📉 <span style='color: #c33636; font-weight: bold;'>Bearish ⬇️</span>";

            const dataFields = {
                "📊 Trend": betTypeText,
                "📈 Token": entry.symbol,
                "💰 Bet Amount": `$${betAmount.toFixed(2)}`,
                "💰 Tokens Bought": tokensBought.toFixed(2),
                "📊 Start Price": `$${entry.startPrice.toFixed(7)}`,
                "📉 End Price": `$${entry.endPrice.toFixed(7)}`,
                "🕒 Created At": new Date(entry.createdAt).toLocaleString(),
                "⏳ Expires At": new Date(entry.expiresAt).toLocaleString(),
            };

            Object.entries(dataFields).forEach(([key, value]) => {
                const rowWrapper = document.createElement('div');
                rowWrapper.className = 'history-row';

                const keyElement = document.createElement('p');
                keyElement.className = 'history-key';
                keyElement.innerHTML = `<strong>${key}:</strong>`;

                const valueElement = document.createElement('p');
                valueElement.className = 'history-value';
                valueElement.innerHTML = value;

                rowWrapper.appendChild(keyElement);
                rowWrapper.appendChild(valueElement);
                historyContent.appendChild(rowWrapper);

                const separator = document.createElement('div');
                separator.className = 'history-separator';
                historyContent.appendChild(separator);
            });

            const resultElement = document.createElement('p');
            resultElement.className = `tx-result ${isWin ? 'win' : isLose ? 'lose' : 'even'}`;
            resultElement.innerHTML = profitLossText;
            resultElement.style.color = profitLossColor;

            historyItem.appendChild(historyContent);
            historyItem.appendChild(resultElement);
            historyList.appendChild(historyItem);
        });

        currentPage++;
        isLoading = false;
    } catch (error) {
        console.error("Failed to fetch history data:", error);
        showErrorPopup_("error", "Failed to load transaction history. Please try again.");
        isLoading = false;
    }
}

function handleScroll() {
    if (historySection.scrollHeight - historySection.scrollTop <= historySection.clientHeight + 50) {
        loadHistory(currentPage);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const scrollToTopButton = document.getElementById("scrollToTop");
    const historySection = document.getElementById("history-content");

    function checkScroll() {
        if (!historySection) return;

        let scrollY = historySection.scrollTop;
        let canScroll = historySection.scrollHeight > historySection.clientHeight;

        if (canScroll && scrollY > 10) {
            scrollToTopButton.classList.add("show");
            scrollToTopButton.classList.remove("hide");
        } else {
            scrollToTopButton.classList.add("hide");
            scrollToTopButton.classList.remove("show");
        }
    }

    function scrollToTop() {
        if (historySection) {
            historySection.scrollTo({top: 0, behavior: "smooth"});
        }
    }

    if (historySection) {
        historySection.addEventListener("scroll", checkScroll);
    }

    scrollToTopButton.addEventListener("click", scrollToTop);

});

historySection.addEventListener("scroll", handleScroll);

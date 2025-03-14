import {GetUserID, Initialize} from "./GetUserID.js";
import {loadHistory} from "./HistorySection.js";
import {loadReferrals} from "./Referrals.js";
import {updateBalanceUI} from "./CheckUserAndWallet.js";

export let tg = null;

document.addEventListener("DOMContentLoaded", () => {
    Telegram.WebApp.expand();
    tg = Telegram.WebApp;

    initializeData();
});

document.addEventListener('touchmove', function (event) {
    if (!event.target.closest('.home-section, .wallet-section, .referrals-section, .transaction-section, .history-section')) {
        event.preventDefault();
    }
}, { passive: false });

function initializeData() {
    Initialize();

    if (!GetUserID()) {
        showErrorPopup("error", "User ID is missing in the URL.");
        return false;
    }
}

let currentTab = '';

window.setActiveTab = async function (selectedTab) {
    await showLoader();

    try {
        const navItems = document.querySelectorAll('.nav-item');
        const scrollToTopButton = document.getElementById("scrollToTop");

        scrollToTopButton.classList.add("hide");
        scrollToTopButton.classList.remove("show");

        navItems.forEach(item => item.classList.remove('active'));

        selectedTab.classList.add('active');

        let newTab = selectedTab.classList.contains('home') ? 'home' :
            selectedTab.classList.contains('wallet') ? 'wallet' :
                selectedTab.classList.contains('transaction') ? 'transaction' :
                    selectedTab.classList.contains('referrals') ? 'referrals' :
                        selectedTab.classList.contains('history') ? 'history' : null;

        if (newTab === currentTab) {
            await hideLoader();
            return;
        }

        currentTab = newTab;

        document.querySelectorAll('.home-section, .wallet-section, .transaction-section, .history-section, .referrals-section')
            .forEach(section => {
                section.classList.add('hidden');
                section.style.display = "none";
            });

        if (currentTab !== 'referrals') {
            document.getElementById('referral-list').innerHTML = "";
        }

        let activeSection = document.getElementById(`${currentTab}-content`);
        if (activeSection) {
            activeSection.classList.remove('hidden');
            activeSection.style.display = "block";
        }

        if(currentTab !== 'referrals') {
            document.body.classList.remove('referrals-active');
        }


        if (currentTab === 'home') {
            // await GetUserBalance(await getWalletBalance(activeWallet));
            updateBalanceUI();
        } else if (currentTab === 'transaction') {

        } else if (currentTab === 'referrals') {
            document.getElementById('referrals-content').classList.remove('hidden');
            document.body.classList.add('referrals-active');
            await loadReferrals();
            await initReferralChart();
        } else if (currentTab === 'history') {
            await loadHistory();
        }

    } catch (error) {
        console.error("Error when changing tabs:", error);
    } finally {
        await hideLoader();
    }
};

async function showLoader() {
    document.getElementById("loading-panel").classList.remove("hidden");
}

async function hideLoader() {
    document.getElementById("loading-panel").classList.add("hidden");
}
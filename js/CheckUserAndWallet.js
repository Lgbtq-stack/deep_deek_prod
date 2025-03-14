import {userData} from './GetUserID.js';
import {fetchWalletDataFromAPI} from "./WalletController.js";

export function updateBalanceUI() {
    const balanceElement = document.getElementById("balance-value");
    const balanceBotElement = document.getElementById("balance-bot");
    balanceElement.innerText = /*"Balance: \n" + */`$${userData.balance.toFixed(2)}`;
    balanceBotElement.innerText = "Balance in use:" + `$${userData.balance_block.toFixed(2)}`;
}

export async function checkUserAndWallets() {

    console.log("Fetching wallets from API...");
    await fetchWalletDataFromAPI();

    console.log(`Checking wallet from API...${userData}`);
    // if (!userData.wallets || userData.wallets.length === 0) {
    //     await setActiveTab(document.querySelector('.nav-item.wallet'));
        // openWalletPopup_("Add Wallet", "Enter wallet address", "Add Wallet", true);
        // blockOtherTabs();
    // }
}

function blockOtherTabs() {
    const navItems = document.querySelectorAll('.nav-item:not(.wallet)');
    navItems.forEach(item => {
        item.style.pointerEvents = 'none';
        item.style.opacity = '.25';
    });
}

function unblockOtherTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.style.pointerEvents = 'auto';
        item.style.opacity = '1';
    });
}

export function onWalletAdded() {
    unblockOtherTabs();
    // showErrorPopup_("success", "Wallet added successfully. You can now use the site.");
}

export async function checkWalletExists(userId, walletAddress) {
    try {
        const response = await fetch(`https://www.miniappservbb.com/api/wallet/check?address=${walletAddress}`);

        if (!response.ok) {
            throw new Error(`Failed to check wallet: ${response.status}`);
        }

        const result = await response.json();

        if (result.exists) {
            console.log(`Wallet ${walletAddress} already exists for user ${userId}.`);
            return { exists: true, message: "Wallet already exists." };
        } else {
            console.log(`Wallet ${walletAddress} does not exist for user ${userId}.`);
            return { exists: false, message: "Wallet not found." };
        }
    } catch (error) {
        console.error("Error checking wallet existence:", error);
        return { exists: false, message: "Error checking wallet. Please try again." };
    }
}

import {user_Id} from "./GetUserID.js";
import {closePopup_, showErrorPopup_, showToast_} from "../Modular/Popups/PopupController.js";
import {updateBalanceUI} from "./CheckUserAndWallet.js";

export async function loadReferrals() {
    let referralData;

    try {
        const response = await fetch(`https://miniappservbb.com/api/referrer?uid=${488916773}`);

        if (!response.ok) {
            throw new Error("❌ Ошибка загрузки данных с сервера.");
        }

        referralData = await response.json();
        console.log("✅ Данные с сервера:", referralData);
    } catch (error) {
        console.error("❌ Ошибка загрузки рефералов:", error);
        showErrorPopup_("error", "Failed to load referrals. Please try again.");
        return;
    }

    updateReferralsUI(referralData);
    return referralData;
}

function updateReferralsUI(data) {
    const totalBonusesElement = document.getElementById("referral-total");
    const referralList = document.getElementById("referral-list");

    if (!totalBonusesElement || !referralList) {
        console.error("❌ Referral elements not found in DOM.");
        return;
    }

    referralList.innerHTML = "";
    referralList.scrollTop = 0;

    if (!data || !data.referral_transactions || Object.keys(data.referral_transactions).length === 0) {
        totalBonusesElement.innerText = "$0.00";
        referralList.innerHTML = `<div class="referral-item">No referrals yet.</div>`;
        return;
    }

    const totalBonuses = Object.values(data.referral_transactions).reduce((sum, bonus) => sum + bonus, 0);
    totalBonusesElement.innerText = `$${totalBonuses.toFixed(2)}`;

    Object.entries(data.referral_transactions).forEach(([id, bonus]) => {
        const referralItem = document.createElement("div");
        referralItem.classList.add("referral-item");

        referralItem.innerHTML = `
            <p>👤 <strong>User:</strong> #${id}</p>
            <p>💰 <strong>Earned:</strong> ~$${bonus.toFixed(2)}</p>
        `;

        referralList.appendChild(referralItem);
    });

    referralList.scrollTop = 0;
}

window.submitReferralId = submitReferralId;

export async function submitReferralId() {
    const referralId = document.getElementById("referral-input").value.trim();

    if (!referralId) {
        showErrorPopup_("warning", "Please enter a referral ID.");
        return;
    }

    try {
        const url = `https://www.miniappservbb.com/api/referrer/submit?uid=${488916773}&referrer_id=${referralId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        showToast_("✅ Referral ID submitted!");
        closePopup_();
    } catch (error) {
        console.error("Error submitting referral ID:", error);
        showErrorPopup_("error", "Failed to submit referral ID. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const scrollToTopButton = document.getElementById("scrollToTop");
    const referralSection = document.getElementById("referrals-content");

    function checkScroll() {
        if (!referralSection) return;

        let scrollY = referralSection.scrollTop;
        let canScroll = referralSection.scrollHeight > referralSection.clientHeight;

        console.log("🔥 ScrollY:", scrollY, "Can Scroll:", canScroll);

        if (canScroll && scrollY > 10) {
            scrollToTopButton.classList.add("show");
            scrollToTopButton.classList.remove("hide");
        } else {
            scrollToTopButton.classList.add("hide");
            scrollToTopButton.classList.remove("show");
        }
    }

    function scrollToTop() {
        if (referralSection) {
            referralSection.scrollTo({top: 0, behavior: "smooth"});
        }
    }

    if (referralSection) {
        referralSection.addEventListener("scroll", checkScroll);
    }

    scrollToTopButton.addEventListener("click", scrollToTop);

    console.log("✅ Scroll-to-top for referrals loaded!");
});


export function updateUserUI(data) {
    const submitReferralButton = document.getElementById("submit-referral-btn");
    const referralIdText = document.getElementById("referral-id");
    updateBalanceUI();

    if (!data) {
        console.error("❌ No user data found.");
        return;
    }

    if (data.referrer === null) {
        submitReferralButton.disabled = false;
        submitReferralButton.classList.remove("disabled");
    } else {
        submitReferralButton.disabled = true;
        submitReferralButton.classList.add("disabled");
    }

    if (referralIdText) {
        referralIdText.innerText = data.user_id;
    }
}

export const errorPopup_ = document.getElementById("epus-error-popup");
export const errorTitle_ = document.getElementById("epus-error-title");
export const errorMessage_ = document.getElementById("epus-error-message");
export const addWalletPopup_ = document.getElementById("wallet-popup");
export const withdrawPopup_ = document.getElementById("withdraw-popup");
export const rechargePopup_ = document.getElementById("recharge-popup");
export const linkAddressUrl_ = document.getElementById("link-address-popup");
export const invitePopup_ = document.getElementById("ref-invite-popup");
export const submitRef_ = document.getElementById("ref-submit-popup");

export function showErrorPopup_(type, message) {

    if (type === "error") {
        errorTitle_.textContent = "⛔️ Error";
    } else if (type === "warning") {
        errorTitle_.textContent = "⚠️ Warning";
    } else if (type === "success") {
        errorTitle_.textContent = "✅ Success";
    }

    errorMessage_.innerHTML = message;
    errorPopup_.style.display = "flex";
}

export function openWithdrawPopup_(title = "Withdraw Funds", placeholder = "Enter amount", buttonText = "Confirm") {
    document.getElementById('withdraw-title').innerText = title;
    document.getElementById('withdraw-input').placeholder = placeholder;
    document.getElementById('withdraw-confirm-button').innerText = buttonText;
    document.getElementById('withdraw-popup').style.display = 'flex';
    disableScroll();
    toggleSidePanel_(true);

}

export function openWalletPopup_(title = "Add Wallet", placeholder = "Enter wallet address", buttonText = "Add Wallet", disableClick = false) {
    const walletPopup = document.getElementById("wallet-popup");

    document.getElementById('wallet-title').innerText = title;
    document.getElementById('wallet-input').placeholder = placeholder;
    document.getElementById('wallet-confirm-button').innerText = buttonText;

    walletPopup.style.display = 'flex';
    disableScroll();
    toggleSidePanel_(true);

    let isClickDisabled = disableClick;

    walletPopup.onclick = function(event) {
        if (isClickDisabled) {
            event.stopPropagation();
        } else {
            walletPopup.onclick = function() {
                closePopup_();
            };
        }
    };
}

export function openRechargePopup_() {
    rechargePopup_.style.display = 'flex';
    disableScroll();
}

export function openWebPage_() {
    const url = linkAddressUrl_.textContent.trim();
    if (url) {
        window.open(url, '_blank');
    } else {
        console.error("URL is empty or invalid.");
    }
}

export function openTestPage1_() {
    const url = "https://google.com/";
    if (url) {
        window.open(url, '_blank');
    } else {
        console.error("URL is empty or invalid.");
    }
}

export function openTestPage2_() {
    const url = "https://bing.com/";
    if (url) {
        window.open(url, '_blank');
    } else {
        console.error("URL is empty or invalid.");
    }
}

export function openPopup_(popup_id) {
    if (popup_id.includes("ref-invite-popup")) {
        invitePopup_.style.display = "flex";

        disableScroll_();
    } else if (popup_id.includes("ref-submit-popup")) {

        document.getElementById("referral-input").value = ""; // Очистка input
        submitRef_.style.display = "flex";

        disableScroll_();
    }
    toggleSidePanel_(true);

}

export function showToast_(message) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;

    toast.classList.remove('animate');
    void toast.offsetWidth;
    toast.classList.add('animate');
}

export function copyToClipboard_(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID "${elementId}" not found.`);
        return;
    }

    const text = element.textContent.trim();

    if (text.length === 0) {
        showToast("Nothing to copy!");
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => showToast("✅ Copied to clipboard"))
        .catch((err) => {
            console.error("Failed to copy text: ", err);
            showToast("Failed to copy text.");
        });
}

export function closeErrorPopup_() {
    console.log("closeErrorPopup_");

    errorPopup_.style.display = "none";
    enableScroll();
}

export function closePopup_() {

    addWalletPopup_.style.display = 'none';
    withdrawPopup_.style.display = 'none';
    rechargePopup_.style.display = 'none';
    invitePopup_.style.display = 'none';
    submitRef_.style.display = 'none';
    toggleSidePanel_(false);
    enableScroll();
}

export function disableScroll_() {
    document.body.classList.add('no-scroll');
}

export function enableScroll_() {
    document.body.classList.remove('no-scroll');
}

export function toggleSidePanel_(isPopupOpen) {
    const sidePanel = document.querySelector(".side-panel");

    sidePanel.style.display = isPopupOpen ? "none" : "block";
    console.log(isPopupOpen);
}
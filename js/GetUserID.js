import {updateUserUI} from "./Referrals.js";
import {updateReferralPanel} from "./Shortcut.js";
import {checkUserAndWallets} from "./CheckUserAndWallet.js";

export let user_Id = "";
let localUserID = "488916773";

export let activeWallet = "";

export let userData = {}

export function SetUserData(data) {
    userData = data;
}

let isInitialized = false;
export let debug = true;

export async function Initialize() {
    isInitialized = true;

    user_Id = getUserIdFromURL();
    console.log("User ID:", user_Id);

    await checkUserAndWallets();
    updateUserUI(userData);
    updateReferralPanel(userData);
}

function getUserIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    user_Id = urlParams.get("user_id");

    if(debug) {
        user_Id = localUserID;
    }

    if (user_Id) {
        console.log(`User ID from URL: ${user_Id}`);
        return user_Id;
    } else {
        console.warn("User ID not found in the URL.");
        return null;
    }
}

export function GetUserID() {
    return user_Id;
}
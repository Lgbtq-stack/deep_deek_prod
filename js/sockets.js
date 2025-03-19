import {updateTransactionsUI} from "./TransactionSection.js";

const socket = io("wss://miniappservbb.com", {
    path: "/socket.io/",
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
});

socket.on("connect", () => {
    console.log("✅ Connected to WebSocket");
    socket.emit("subscribe", "488916773");
});

socket.on("connect_error", (error) => {
    console.error("❌ Error connecting to WebSocket:", error);
});

socket.on("update", (bets) => {
//    console.log("🔥 Обновление ставок:", bets);

    updateTransactionsUI(bets);
});

// socket.ts
import { apiUrl } from "@/config/apiUrl";
import { io, Socket } from "socket.io-client";
// connecting to the Zwilt server
const connectionURL =
  process.env.NEXT_PUBLIC_APP_SERVER || "http://localhost:5000";

export const socket: Socket = io(connectionURL, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log(`Connected to Zwilt server `);
});

socket.on("connect_error", (error) => {
  console.error("Unable to connect to Zwilt server:", error);
});

socket.on("disconnect", (reason) => {
  console.warn("Disconnected from Zwilt server:", reason);
});

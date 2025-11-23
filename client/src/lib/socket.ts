import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initializeSocket(userId: string) {
  if (socket) return socket;

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const socketUrl = `${protocol}//${window.location.host}`;

  socket = io(socketUrl, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
    socket?.emit("user:join", userId);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Message events
export function emitMessage(senderId: string, recipientId: string, message: string) {
  if (!socket) return;
  const conversationId = [senderId, recipientId].sort().join("_");
  socket.emit("message:send", {
    senderId,
    recipientId,
    message,
    conversationId,
    timestamp: new Date().toLocaleTimeString()
  });
}

export function loadMessages(senderId: string, recipientId: string) {
  if (!socket) return;
  socket.emit("messages:load", { senderId, recipientId });
}

export function onMessageReceived(callback: (message: any) => void) {
  if (!socket) return;
  socket.on("message:receive", callback);
}

export function onMessageSent(callback: (data: any) => void) {
  if (!socket) return;
  socket.on("message:sent", callback);
}

export function onMessagesLoaded(callback: (messages: any[]) => void) {
  if (!socket) return;
  socket.on("messages:loaded", callback);
}

export function onNotification(callback: (notification: any) => void) {
  if (!socket) return;
  socket.on("notification:new", callback);
}

export function offAllEvents() {
  if (!socket) return;
  socket.off("message:receive");
  socket.off("message:sent");
  socket.off("messages:loaded");
  socket.off("notification:new");
}

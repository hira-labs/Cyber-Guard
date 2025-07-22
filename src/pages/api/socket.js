import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    }
  });

  io.on("connection", (socket) => {
    console.log("New connection established");
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export const notifyThreat = (threatData) => {
  if (io) {
    io.emit("new-threat", threatData);  // Emit a new threat alert to the client
  }
};

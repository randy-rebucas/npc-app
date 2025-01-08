import { NextResponse } from "next/server";
import { Server } from "socket.io";

export const runtime = "edge";

export async function GET() {
  try {
    const io = new Server();

    io.on("connection", (socket) => {
      console.log("a user connected");

      // Example: Emit a notification
      socket.emit("notification", { message: "Welcome to the app!" });

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    return NextResponse.json({ message: "Socket.IO server is running" });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch states ${error}` },
      { status: 500 }
    );
  }
}

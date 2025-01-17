import { NextResponse } from "next/server";
// import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connect from "@/lib/db";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// request: Request
export async function POST() {
  try {
    // const { message } = await request.json();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();
    // Optional: Get the current user

    // const userId = session?.user?.id;
    return NextResponse.json({ message: "Hello" });
    // // Store user message
    // const userMessage = await Message.create({
    //   content: message,
    //   sender: "user",
    //   user: userId,
    //   createdAt: new Date(),
    // });

    // // Get chat history for context (last 10 messages)
    // const history = await Message.find({ user: userId })
    //   .sort({ createdAt: -1 })
    //   .limit(10);

    // // Format messages for OpenAI
    // const chatMessages = [
    //   { role: "system", content: "You are a helpful assistant." },
    //   ...history.reverse().map((msg) => ({
    //     role: msg.sender === "user" ? "user" : "assistant",
    //     content: msg.content,
    //   })),
    //   { role: "user", content: message },
    // ];

    // // Get response from OpenAI
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: chatMessages as OpenAI.Chat.ChatCompletionMessageParam[],
    //   temperature: 0.7,
    //   max_tokens: 500,
    // });

    // const aiResponse =
    //   completion.choices[0]?.message?.content || "No response generated.";

    // // Store AI response
    // const assistantMessage = await Message.create({
    //   content: aiResponse,
    //   sender: "assistant",
    //   user: userId,
    //   createdAt: new Date(),
    // });

    // return NextResponse.json({
    //   message: aiResponse,
    //   userMessage,
    //   assistantMessage,
    // });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}

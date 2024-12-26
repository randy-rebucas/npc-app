"use server";

import Event, { IEvent } from "../models/Event";
import connect from "@/lib/db";

export async function createEvent(event: Omit<IEvent, "createdAt">) {
  await connect();
  return await Event.create(event);
}

interface GetEventsParams {
  page: number;
  search?: string;
  type?: string;
  limit?: number;
}

interface EventQuery {
  $or?: {
    user?: { $regex: string; $options: string } | string;
    email?: { $regex: string; $options: string } | string;
  }[];
  type?: string;
}

export interface EventDocument {
  _id: string; // We'll cast this to string anyway
  user: string;
  email: string;
  type: "logged-in" | "member-updated" | "member-created" | "member-deleted" | "member-synced";
  createdAt: Date;
}

interface GetEventsResponse {
  events: {
    id: string;
    user: string;
    email: string;
    type:
      | "logged-in"
      | "member-updated"
      | "member-created"
      | "member-deleted"
      | "member-synced";
    createdAt: Date;
  }[];
  total: number;
}

export async function getEvents({
  page = 1,
  search = "",
  type = "all",
  limit = 10,
}: GetEventsParams): Promise<GetEventsResponse> {
  try {
    await connect();
    // Build query conditions
    const query: EventQuery = {};

    if (search) {
      query.$or = [
        { user: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (type !== "all") {
      query.type = type;
    }


    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Event.countDocuments(query),
    ]);

    return {
      events: (events as unknown as EventDocument[]).map((event) => ({
        id: event._id.toString(),
        user: event.user,
        email: event.email,
        type: event.type,
        createdAt: event.createdAt,
      })),
      total,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

"use server";

import Event, { IEvent } from "../models/Event";
import connect from "@/lib/db";

export async function createEvent(event: Omit<IEvent, 'createdAt'>) {
  await connect();
  return await Event.create(event);
}

export async function getEvents({ page = 1, limit = 10 }: { page: number, limit: number }) {
  await connect();
  const skip = (page - 1) * limit;
  
  const events = await Event.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Event.countDocuments();
  
  return {
    events,
    total,
    pages: Math.ceil(total / limit)
  };
} 
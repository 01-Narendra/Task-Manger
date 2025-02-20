import { db } from "@/db";
import { tasks } from "@/schema/schema";
import { eq } from "drizzle-orm";
import { Rewind } from "lucide-react";
import { NextResponse } from "next/server";

// Get all tasks
export async function POST(req: Request) {
  try {
    console.log("inside main api")
    const {currentUser} = await req.json();
    const allTasks = await db.select().from(tasks).where(eq(tasks.user, currentUser));
    
    if (!allTasks) {
      return NextResponse.json({ message: "No tasks found" }, { status: 404 });
    }
    return NextResponse.json(allTasks);
  } catch (error) {
    console.log("error while fetching tasks", error);
    return NextResponse.json({ message: "Failed to fetch tasks" }, { status: 500 });
  }
}
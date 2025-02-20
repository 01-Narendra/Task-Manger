import { db } from "@/db";
import { tasks } from "@/schema/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { user, taskId, status } = await req.json();
  // add the date in format YYYY-MM-DD in column completedon
  if (status === "completed") {
    const date = new Date().toISOString().split("T")[0];
    try {
      const response = await db.update(tasks).set({ status, completedon: date }).where(and(eq(tasks.user, user), eq(tasks.id, taskId)));
      if (!response) 
        return NextResponse.json({ message: "Failed to update task status" }, { status: 404 });

      return NextResponse.json({ message: "Task status updated" });
    } catch (error) {
      console.log("error while updating task status", error);
      return NextResponse.json({ message: "Failed to update task status" }, { status: 500 });
      
    }
  }
  
  try {
    const response = await db.update(tasks).set({ status, completedon: null }).where(and(eq(tasks.user, user), eq(tasks.id, taskId)));
    if (!response) 
      return NextResponse.json({ message: "Failed to update task status" }, { status: 404 });

    return NextResponse.json({ message: "Task status updated" });
  } catch (error) {
    console.log("error while updating task status", error);
    return NextResponse.json({ message: "Failed to update task status" }, { status: 500 });
  }
}
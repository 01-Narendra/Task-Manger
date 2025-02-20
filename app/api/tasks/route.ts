import { NextResponse } from "next/server";
import { db } from "@/db";

import { and, eq } from "drizzle-orm";
import { tasks } from "@/schema/schema";


// Create a new task
export async function POST(req: Request) {
  const { title, description, priority, dueDate, user } = await req.json();
  
  try {
    const response = await db.insert(tasks).values({ title, description, priority, dueDate, user });

    if(!response) {
      return NextResponse.json({ message: "Failed to create task" }, { status: 500 });
    }
    return NextResponse.json({ message: "Task created" }, { status: 201 });
  } catch (error) {
    console.log("error while creating task", error);
    return NextResponse.json({ message: "Failed to create task" }, { status: 500 });
  }
  
}

// Delete a task
export async function DELETE(req: Request) {
  const { user, taskId } = await req.json();
  // console.log("user", user, "taskId", taskId);
  try {
    const response = await db.delete(tasks).where(and(eq(tasks.id, taskId), eq(tasks.user, user)));
    if (!response) 
      return NextResponse.json({ message: "Failed to delete task" }, { status: 404 });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.log("error while deleting task", error);
    return NextResponse.json({ message: "Failed to delete task" }, { status: 500 });
    
  }
  
}

export async function PATCH(req: Request) {
  const { user, taskId, priority } = await req.json();
  console.log("user", user, "taskId", taskId, "priority", priority);
  try {
    const response = await db.update(tasks).set({ priority }).where(and(eq(tasks.user, user), eq(tasks.id, taskId)));
    if (!response) 
      return NextResponse.json({ message: "Failed to update task priority" }, { status: 404 });

    return NextResponse.json({ message: "Task priority updated" });
  } catch (error) {
    console.log("error while updating task priority", error);
    return NextResponse.json({ message: "Failed to update task priority" }, { status: 500 });
    
  }
}

import { db } from "@/db";
import { users } from "@/schema/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name) {
      return new Response("Name is required", { status: 400 });
    }
    if (!email) {
      return new Response("Email is required", { status: 400 });
    }
    if (!password) {
      return new Response("Password is required", { status: 400 });
    }
    
    // add the check for email is present in db
    const user = await db.select().from(users).where(eq(users.email, email)).execute()
    if (user.length) {
      return new Response("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
    }).returning();

    if (!newUser) {
      return new Response("Failed to create user", { status: 500 });
    }

    return Response.json(newUser);
  } catch (error) {
    console.error("Error in POST /api/sign-up:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error !! something went wrong", error: error }), { status: 500 });
  }
}



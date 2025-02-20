import { date, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { time } from "drizzle-orm/singlestore-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"),
  priority: text("priority").default("medium"),
  dueDate: date("due_date"),
  completedon: date("completedon"),
  user: varchar("user").references(() => users.email),
  createdAt: timestamp("created_at").defaultNow(),
});

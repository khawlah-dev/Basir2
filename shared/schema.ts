import { pgTable, text, serial, integer, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'admin', 'principal', 'teacher'
  schoolId: integer("school_id").references(() => schools.id, { onDelete: "cascade" }), // null for admin
});

export const flags = pgTable("flags", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  authorId: integer("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const evidences = pgTable("evidences", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  criteria: text("criteria").notNull(), // which criteria it covers
  description: text("description").notNull(),
  fileUrl: text("file_url").notNull(), // path to the file
  fileType: text("file_type").notNull().default("image"), // image, video, document
  status: text("status").notNull().default("pending"), // pending, approved
  createdAt: timestamp("created_at").defaultNow(),
});

export const indicators = pgTable("indicators", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // volunteering, training
  hours: integer("hours").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  evaluatorId: integer("evaluator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  aiScore: real("ai_score").notNull(),
  manualScore: real("manual_score"),
  totalScore: real("total_score").notNull(),
  details: jsonb("details").notNull(), // AI response details
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertSchoolSchema = createInsertSchema(schools).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertFlagSchema = createInsertSchema(flags).omit({ id: true, createdAt: true });
export const insertEvidenceSchema = createInsertSchema(evidences).omit({ id: true, createdAt: true, status: true });
export const createEvidenceSchema = insertEvidenceSchema.omit({ fileUrl: true, fileType: true });
export const insertIndicatorSchema = createInsertSchema(indicators).omit({ id: true, createdAt: true, status: true });
export const insertEvaluationSchema = createInsertSchema(evaluations).omit({ id: true, createdAt: true });

// Exports types
export type School = typeof schools.$inferSelect;
export type User = typeof users.$inferSelect;
export type Flag = typeof flags.$inferSelect;
export type Evidence = typeof evidences.$inferSelect;
export type Indicator = typeof indicators.$inferSelect;
export type Evaluation = typeof evaluations.$inferSelect;

export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertFlag = z.infer<typeof insertFlagSchema>;
export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;
export type InsertIndicator = z.infer<typeof insertIndicatorSchema>;
export type InsertEvaluation = z.infer<typeof insertEvaluationSchema>;

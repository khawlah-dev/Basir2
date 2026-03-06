import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  schools, users, flags, evidences, indicators, evaluations,
  type School, type InsertSchool,
  type User, type InsertUser,
  type Flag, type InsertFlag,
  type Evidence, type InsertEvidence,
  type Indicator, type InsertIndicator,
  type Evaluation, type InsertEvaluation
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<void>;
  getUsers(): Promise<User[]>;

  // Schools
  getSchools(): Promise<School[]>;
  createSchool(school: InsertSchool): Promise<School>;
  deleteSchool(id: number): Promise<void>;

  // Flags
  getFlags(): Promise<Flag[]>;
  createFlag(flag: InsertFlag): Promise<Flag>;
  deleteFlag(id: number): Promise<void>;

  // Evidences
  getEvidences(): Promise<Evidence[]>;
  createEvidence(evidence: InsertEvidence): Promise<Evidence>;
  approveEvidence(id: number): Promise<Evidence | undefined>;

  // Indicators
  getIndicators(): Promise<Indicator[]>;
  createIndicator(indicator: InsertIndicator): Promise<Indicator>;
  approveIndicator(id: number): Promise<Indicator | undefined>;

  // Evaluations
  getEvaluations(): Promise<Evaluation[]>;
  createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getSchools(): Promise<School[]> {
    return await db.select().from(schools);
  }

  async createSchool(school: InsertSchool): Promise<School> {
    const [newSchool] = await db.insert(schools).values(school).returning();
    return newSchool;
  }

  async deleteSchool(id: number): Promise<void> {
    await db.delete(schools).where(eq(schools.id, id));
  }

  async getFlags(): Promise<Flag[]> {
    return await db.select().from(flags);
  }

  async createFlag(flag: InsertFlag): Promise<Flag> {
    const [newFlag] = await db.insert(flags).values(flag).returning();
    return newFlag;
  }

  async deleteFlag(id: number): Promise<void> {
    await db.delete(flags).where(eq(flags.id, id));
  }

  async getEvidences(): Promise<Evidence[]> {
    return await db.select().from(evidences);
  }

  async createEvidence(evidence: InsertEvidence): Promise<Evidence> {
    // Delete old evidence with the same teacherId and criteria
    await db.delete(evidences).where(
      and(
        eq(evidences.teacherId, evidence.teacherId),
        eq(evidences.criteria, evidence.criteria)
      )
    );
    
    const [newEvidence] = await db.insert(evidences).values(evidence).returning();
    return newEvidence;
  }

  async approveEvidence(id: number): Promise<Evidence | undefined> {
    const [updated] = await db.update(evidences).set({ status: 'approved' }).where(eq(evidences.id, id)).returning();
    return updated;
  }

  async getIndicators(): Promise<Indicator[]> {
    return await db.select().from(indicators);
  }

  async createIndicator(indicator: InsertIndicator): Promise<Indicator> {
    const [newIndicator] = await db.insert(indicators).values(indicator).returning();
    return newIndicator;
  }

  async approveIndicator(id: number): Promise<Indicator | undefined> {
    const [updated] = await db.update(indicators).set({ status: 'approved' }).where(eq(indicators.id, id)).returning();
    return updated;
  }

  async getEvaluations(): Promise<Evaluation[]> {
    return await db.select().from(evaluations);
  }

  async createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation> {
    // Delete any old evaluation for this teacher to ensure only one exists
    await db.delete(evaluations).where(eq(evaluations.teacherId, evaluation.teacherId));
    
    const [newEvaluation] = await db.insert(evaluations).values(evaluation).returning();
    return newEvaluation;
  }
}

export const storage = new DatabaseStorage();
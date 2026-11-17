
import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const masjids = pgTable("masjids", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),
  address: text("address"),

  // Bangladesh 64 Districts (Bangla)
  district: varchar("district", { length: 50 }).notNull(),

  // Jamaat times stored as HH:MM (24-hour format)
  fajr: varchar("fajr", { length: 5 }),
  dhuhr: varchar("dhuhr", { length: 5 }),
  asr: varchar("asr", { length: 5 }),
  maghrib: varchar("maghrib", { length: 5 }),
  isha: varchar("isha", { length: 5 }),
  jummah: varchar("jummah", { length: 5 }),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Masjid = typeof masjids.$inferSelect;
export type NewMasjid = typeof masjids.$inferInsert;

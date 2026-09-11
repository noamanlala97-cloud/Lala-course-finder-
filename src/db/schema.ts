import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, real } from 'drizzle-orm/pg-core';

// Users table (identifying via Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// User academic profile for matching
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid),
  degree: text('degree'),
  cgpa: real('cgpa'),
  maxGrade: real('max_grade').default(10.0),
  minPassGrade: real('min_pass_grade').default(4.0),
  ielts: real('ielts'),
  germanLevel: text('german_level'),
  bavarianGrade: real('bavarian_grade'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Saved programs / Study plan
export const savedCourses = pgTable('saved_courses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid),
  courseId: text('course_id').notNull(),
  courseName: text('course_name').notNull(),
  universityName: text('university_name').notNull(),
  degree: text('degree'),
  language: text('language'),
  deadline: text('deadline'),
  matchScore: integer('match_score'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Transcripts uploaded / evaluated
export const transcripts = pgTable('transcripts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.uid),
  fileName: text('file_name').notNull(),
  fileSize: text('file_size'),
  extractedEcts: integer('extracted_ects').default(216),
  calculatedGrade: real('calculated_grade'),
  parsedConfidence: text('parsed_confidence').default('99.4%'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.uid],
    references: [userProfiles.userId],
  }),
  savedCourses: many(savedCourses),
  transcripts: many(transcripts),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.uid],
  }),
}));

export const savedCoursesRelations = relations(savedCourses, ({ one }) => ({
  user: one(users, {
    fields: [savedCourses.userId],
    references: [users.uid],
  }),
}));

export const transcriptsRelations = relations(transcripts, ({ one }) => ({
  user: one(users, {
    fields: [transcripts.userId],
    references: [users.uid],
  }),
}));

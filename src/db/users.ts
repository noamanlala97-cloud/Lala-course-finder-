import { db } from './index.ts';
import { users, userProfiles, savedCourses, transcripts } from './schema.ts';
import { eq, and, desc } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(displayName ? { displayName } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('Failed to synchronize user in database.', { cause: error });
  }
}

export async function getUserProfile(userId: string) {
  try {
    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    return profile[0] || null;
  } catch (error) {
    console.error('Database getUserProfile failed:', error);
    throw new Error('Failed to retrieve user profile from database.', { cause: error });
  }
}

export async function upsertUserProfile(
  userId: string,
  data: {
    degree?: string;
    cgpa?: number;
    maxGrade?: number;
    minPassGrade?: number;
    ielts?: number;
    germanLevel?: string;
    bavarianGrade?: number;
  }
) {
  try {
    const existing = await getUserProfile(userId);
    if (existing) {
      const updated = await db
        .update(userProfiles)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId))
        .returning();
      return updated[0];
    } else {
      const inserted = await db
        .insert(userProfiles)
        .values({
          userId,
          ...data,
        })
        .returning();
      return inserted[0];
    }
  } catch (error) {
    console.error('Database upsertUserProfile failed:', error);
    throw new Error('Failed to save profile in database.', { cause: error });
  }
}

export async function getSavedCourses(userId: string) {
  try {
    return await db
      .select()
      .from(savedCourses)
      .where(eq(savedCourses.userId, userId))
      .orderBy(desc(savedCourses.createdAt));
  } catch (error) {
    console.error('Database getSavedCourses failed:', error);
    throw new Error('Failed to retrieve saved courses from database.', { cause: error });
  }
}

export async function addSavedCourse(
  userId: string,
  course: {
    courseId: string;
    courseName: string;
    universityName: string;
    degree?: string;
    language?: string;
    deadline?: string;
    matchScore?: number;
  }
) {
  try {
    // Check if already saved
    const existing = await db
      .select()
      .from(savedCourses)
      .where(and(eq(savedCourses.userId, userId), eq(savedCourses.courseId, course.courseId)))
      .limit(1);

    if (existing.length > 0) {
      return existing[0];
    }

    const inserted = await db
      .insert(savedCourses)
      .values({
        userId,
        courseId: course.courseId,
        courseName: course.courseName,
        universityName: course.universityName,
        degree: course.degree || null,
        language: course.language || null,
        deadline: course.deadline || null,
        matchScore: course.matchScore || null,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Database addSavedCourse failed:', error);
    throw new Error('Failed to save course to study plan.', { cause: error });
  }
}

export async function removeSavedCourse(userId: string, courseId: string) {
  try {
    await db
      .delete(savedCourses)
      .where(and(eq(savedCourses.userId, userId), eq(savedCourses.courseId, courseId)));
    return { success: true };
  } catch (error) {
    console.error('Database removeSavedCourse failed:', error);
    throw new Error('Failed to remove course from study plan.', { cause: error });
  }
}

export async function addTranscriptRecord(
  userId: string,
  transcript: {
    fileName: string;
    fileSize?: string;
    extractedEcts?: number;
    calculatedGrade?: number;
    parsedConfidence?: string;
  }
) {
  try {
    const inserted = await db
      .insert(transcripts)
      .values({
        userId,
        fileName: transcript.fileName,
        fileSize: transcript.fileSize || null,
        extractedEcts: transcript.extractedEcts || 216,
        calculatedGrade: transcript.calculatedGrade || null,
        parsedConfidence: transcript.parsedConfidence || '99.4%',
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Database addTranscriptRecord failed:', error);
    throw new Error('Failed to store transcript history in database.', { cause: error });
  }
}

export async function getTranscripts(userId: string) {
  try {
    return await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.userId, userId))
      .orderBy(desc(transcripts.createdAt));
  } catch (error) {
    console.error('Database getTranscripts failed:', error);
    throw new Error('Failed to retrieve transcripts from database.', { cause: error });
  }
}

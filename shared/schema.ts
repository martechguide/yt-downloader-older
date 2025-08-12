import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const downloadRequests = pgTable("download_requests", {
  id: serial("id").primaryKey(),
  youtubeUrl: text("youtube_url").notNull(),
  quality: text("quality").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  videoTitle: text("video_title"),
  videoDuration: text("video_duration"),
  videoThumbnail: text("video_thumbnail"),
  filePath: text("file_path"),
  fileSize: integer("file_size"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertDownloadRequestSchema = createInsertSchema(downloadRequests).pick({
  youtubeUrl: true,
  quality: true,
});

export const downloadRequestSchema = insertDownloadRequestSchema.extend({
  youtubeUrl: z.string().url().refine(
    (url) => url.includes('youtube.com/watch') || url.includes('youtu.be/'),
    { message: "Please enter a valid YouTube URL" }
  ),
  quality: z.enum(["128", "192", "320"]),
});

export type InsertDownloadRequest = z.infer<typeof insertDownloadRequestSchema>;
export type DownloadRequest = typeof downloadRequests.$inferSelect;
export type DownloadRequestInput = z.infer<typeof downloadRequestSchema>;

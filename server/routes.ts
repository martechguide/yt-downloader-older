import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { downloadRequestSchema } from "@shared/schema";
import { z } from "zod";
import ytdl from "@distube/ytdl-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create downloads directory if it doesn't exist
  const downloadsDir = path.join(__dirname, '..', 'downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  // Validate YouTube URL and get video info
  app.post("/api/video-info", async (req, res) => {
    try {
      const { youtubeUrl } = req.body;
      
      if (!ytdl.validateURL(youtubeUrl)) {
        return res.status(400).json({ message: "Invalid YouTube URL" });
      }

      const info = await ytdl.getInfo(youtubeUrl);
      const videoDetails = info.videoDetails;

      res.json({
        title: videoDetails.title,
        duration: videoDetails.lengthSeconds,
        thumbnail: videoDetails.thumbnails[0]?.url,
        viewCount: videoDetails.viewCount,
      });
    } catch (error) {
      console.error("Error fetching video info:", error);
      res.status(500).json({ message: "Failed to fetch video information" });
    }
  });

  // Start download process
  app.post("/api/download", async (req, res) => {
    try {
      const validatedData = downloadRequestSchema.parse(req.body);
      
      // Create download request
      const downloadRequest = await storage.createDownloadRequest(validatedData);
      
      // Start processing in background
      processDownload(downloadRequest.id, validatedData);
      
      res.json({ id: downloadRequest.id, status: "pending" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Error starting download:", error);
      res.status(500).json({ message: "Failed to start download" });
    }
  });

  // Get download status
  app.get("/api/download/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const downloadRequest = await storage.getDownloadRequest(id);
      
      if (!downloadRequest) {
        return res.status(404).json({ message: "Download request not found" });
      }
      
      res.json(downloadRequest);
    } catch (error) {
      console.error("Error fetching download status:", error);
      res.status(500).json({ message: "Failed to fetch download status" });
    }
  });

  // Download completed file
  app.get("/api/download/:id/file", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const downloadRequest = await storage.getDownloadRequest(id);
      
      if (!downloadRequest || downloadRequest.status !== "completed" || !downloadRequest.filePath) {
        return res.status(404).json({ message: "File not found" });
      }
      
      const filePath = path.join(__dirname, '..', downloadRequest.filePath);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on disk" });
      }
      
      const fileName = `${downloadRequest.videoTitle || 'audio'}.mp3`;
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'audio/mpeg');
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  async function processDownload(requestId: number, data: { youtubeUrl: string; quality: string }) {
    try {
      // Update status to processing
      await storage.updateDownloadRequest(requestId, { status: "processing" });
      
      // Get video info
      const info = await ytdl.getInfo(data.youtubeUrl);
      const videoDetails = info.videoDetails;
      
      // Update with video details
      await storage.updateDownloadRequest(requestId, {
        videoTitle: videoDetails.title,
        videoDuration: videoDetails.lengthSeconds,
        videoThumbnail: videoDetails.thumbnails[0]?.url,
      });
      
      // Generate filename
      const sanitizedTitle = videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${sanitizedTitle}_${data.quality}kbps.mp3`;
      const outputPath = path.join(downloadsDir, filename);
      
      // Get audio stream with specified quality
      const audioFormat = ytdl.chooseFormat(info.formats, {
        quality: 'highestaudio',
        filter: 'audioonly',
      });
      
      if (!audioFormat) {
        throw new Error("No audio format available");
      }
      
      // Download audio
      const audioStream = ytdl(data.youtubeUrl, {
        format: audioFormat,
        quality: 'highestaudio',
      });
      
      const writeStream = fs.createWriteStream(outputPath);
      
      await new Promise((resolve, reject) => {
        audioStream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        audioStream.on('error', reject);
      });
      
      // Get file size
      const stats = fs.statSync(outputPath);
      const fileSizeInBytes = stats.size;
      
      // Update as completed
      await storage.updateDownloadRequest(requestId, {
        status: "completed",
        filePath: `downloads/${filename}`,
        fileSize: fileSizeInBytes,
        completedAt: new Date(),
      });
      
    } catch (error) {
      console.error("Error processing download:", error);
      await storage.updateDownloadRequest(requestId, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}

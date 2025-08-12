import { downloadRequests, type DownloadRequest, type InsertDownloadRequest } from "@shared/schema";

export interface IStorage {
  createDownloadRequest(request: InsertDownloadRequest): Promise<DownloadRequest>;
  getDownloadRequest(id: number): Promise<DownloadRequest | undefined>;
  updateDownloadRequest(id: number, updates: Partial<DownloadRequest>): Promise<DownloadRequest | undefined>;
  getDownloadRequestsByStatus(status: string): Promise<DownloadRequest[]>;
}

export class MemStorage implements IStorage {
  private downloadRequests: Map<number, DownloadRequest>;
  private currentId: number;

  constructor() {
    this.downloadRequests = new Map();
    this.currentId = 1;
  }

  async createDownloadRequest(insertRequest: InsertDownloadRequest): Promise<DownloadRequest> {
    const id = this.currentId++;
    const request: DownloadRequest = {
      ...insertRequest,
      id,
      status: "pending",
      videoTitle: null,
      videoDuration: null,
      videoThumbnail: null,
      filePath: null,
      fileSize: null,
      errorMessage: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.downloadRequests.set(id, request);
    return request;
  }

  async getDownloadRequest(id: number): Promise<DownloadRequest | undefined> {
    return this.downloadRequests.get(id);
  }

  async updateDownloadRequest(id: number, updates: Partial<DownloadRequest>): Promise<DownloadRequest | undefined> {
    const existing = this.downloadRequests.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.downloadRequests.set(id, updated);
    return updated;
  }

  async getDownloadRequestsByStatus(status: string): Promise<DownloadRequest[]> {
    return Array.from(this.downloadRequests.values()).filter(req => req.status === status);
  }
}

export const storage = new MemStorage();

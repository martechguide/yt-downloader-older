import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link, Download } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProgressStates from "./progress-states";

interface VideoInfo {
  title: string;
  duration: string;
  thumbnail: string;
  viewCount: string;
}

interface DownloadRequest {
  id: number;
  status: string;
  videoTitle?: string;
  videoDuration?: string;
  videoThumbnail?: string;
  errorMessage?: string;
  fileSize?: number;
}

export default function Converter() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [quality, setQuality] = useState("128");
  const [downloadId, setDownloadId] = useState<number | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const { toast } = useToast();

  // Get video info mutation
  const getVideoInfoMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/video-info", { youtubeUrl: url });
      return response.json();
    },
    onSuccess: (data) => {
      setVideoInfo(data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to fetch video information. Please check the URL.",
        variant: "destructive",
      });
    },
  });

  // Start download mutation
  const startDownloadMutation = useMutation({
    mutationFn: async ({ youtubeUrl, quality }: { youtubeUrl: string; quality: string }) => {
      const response = await apiRequest("POST", "/api/download", { youtubeUrl, quality });
      return response.json();
    },
    onSuccess: (data) => {
      setDownloadId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/download", data.id] });
    },
    onError: (error) => {
      toast({
        title: "Conversion Failed",
        description: "Unable to start the conversion process. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Poll download status
  const { data: downloadStatus } = useQuery<DownloadRequest>({
    queryKey: ["/api/download", downloadId],
    enabled: !!downloadId,
    refetchInterval: (data) => {
      // Stop polling when download is complete or failed
      if (data && (data.status === "completed" || data.status === "failed")) {
        return false;
      }
      return 2000;
    },
  });

  const isValidYouTubeUrl = (url: string) => {
    return url.includes('youtube.com/watch') || url.includes('youtu.be/');
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    
    if (url && isValidYouTubeUrl(url) && !videoInfo) {
      getVideoInfoMutation.mutate(url);
    } else if (!url) {
      setVideoInfo(null);
    }
  };

  const handleConvert = () => {
    if (!youtubeUrl || !isValidYouTubeUrl(youtubeUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    startDownloadMutation.mutate({ youtubeUrl, quality });
  };

  const handleDownload = () => {
    if (downloadId && downloadStatus && downloadStatus.status === "completed") {
      window.open(`/api/download/${downloadId}/file`, '_blank');
    }
  };

  const handleReset = () => {
    setYoutubeUrl("");
    setQuality("128");
    setDownloadId(null);
    setVideoInfo(null);
  };

  const getEstimatedSize = (duration: string, quality: string) => {
    const durationSeconds = parseInt(duration);
    const qualityKbps = parseInt(quality);
    const estimatedSizeMB = (durationSeconds * qualityKbps * 0.125) / 1000;
    return estimatedSizeMB.toFixed(1);
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Convert YouTube to MP3</h2>
          <p className="text-gray-600">Paste your YouTube URL below and select your preferred audio quality</p>
        </div>

        <div className="space-y-6">
          {/* URL Input */}
          <div>
            <Label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube Video URL
              </div>
            </Label>
            <div className="relative">
              <Input
                id="youtube-url"
                type="url"
                value={youtubeUrl}
                onChange={handleUrlChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full px-4 py-3 pr-10 transition-colors duration-200 ${
                  youtubeUrl && !isValidYouTubeUrl(youtubeUrl)
                    ? 'border-red-500 focus:ring-red-500'
                    : ''
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Link className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            {youtubeUrl && !isValidYouTubeUrl(youtubeUrl) && (
              <div className="mt-2 text-sm text-red-600">
                <i className="fas fa-exclamation-circle mr-1"></i>
                Please enter a valid YouTube URL
              </div>
            )}
          </div>

          {/* Quality Selector */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Audio Quality
              </div>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: "128", label: "128 kbps", description: "Standard Quality" },
                { value: "192", label: "192 kbps", description: "High Quality" },
                { value: "320", label: "320 kbps", description: "Premium Quality" },
              ].map((option) => (
                <label key={option.value} className="quality-option">
                  <input
                    type="radio"
                    name="quality"
                    value={option.value}
                    checked={quality === option.value}
                    onChange={(e) => setQuality(e.target.value)}
                    className="sr-only"
                  />
                  <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                      <div className="quality-radio w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center">
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Convert Button */}
          <div className="pt-4">
            <Button
              onClick={handleConvert}
              disabled={!youtubeUrl || !isValidYouTubeUrl(youtubeUrl) || startDownloadMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>
                {startDownloadMutation.isPending ? "Starting..." : "Convert & Download MP3"}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Progress States */}
      <ProgressStates
        videoInfo={videoInfo}
        downloadStatus={downloadStatus || null}
        quality={quality}
        getEstimatedSize={getEstimatedSize}
        onDownload={handleDownload}
        onReset={handleReset}
        onRetry={handleConvert}
      />
    </Card>
  );
}

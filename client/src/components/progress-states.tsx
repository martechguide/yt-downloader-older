import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, RefreshCw, Download, Clock, FileAudio } from "lucide-react";

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

interface ProgressStatesProps {
  videoInfo: VideoInfo | null;
  downloadStatus: DownloadRequest | null;
  quality: string;
  getEstimatedSize: (duration: string, quality: string) => string;
  onDownload: () => void;
  onReset: () => void;
  onRetry: () => void;
}

export default function ProgressStates({
  videoInfo,
  downloadStatus,
  quality,
  getEstimatedSize,
  onDownload,
  onReset,
  onRetry,
}: ProgressStatesProps) {
  // Video Info Preview State
  if (videoInfo && !downloadStatus) {
    return (
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <div className="flex items-start space-x-4">
          <img
            src={videoInfo.thumbnail}
            alt="Video thumbnail"
            className="w-24 h-16 object-cover rounded-lg shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{videoInfo.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Duration: {Math.floor(parseInt(videoInfo.duration) / 60)}:{(parseInt(videoInfo.duration) % 60).toString().padStart(2, '0')} • Views: {parseInt(videoInfo.viewCount).toLocaleString()}
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center text-sm text-gray-500">
                <FileAudio className="w-4 h-4 mr-1" />
                <span>{quality} kbps MP3</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Est. size: ~{getEstimatedSize(videoInfo.duration, quality)} MB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Processing State
  if (downloadStatus?.status === "processing") {
    return (
      <div className="border-t border-gray-200 bg-blue-50 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-primary-foreground animate-spin" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Converting to MP3...</h3>
            <p className="text-sm text-gray-600 mb-3">Processing your audio file</p>
            
            {/* Progress Bar */}
            <div className="w-full">
              <Progress value={65} className="w-full h-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Converting audio...</span>
                <span>65%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (downloadStatus?.status === "completed") {
    return (
      <div className="border-t border-gray-200 bg-green-50 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Conversion Complete!</h3>
            <p className="text-sm text-gray-600 mb-4">Your MP3 file is ready for download</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onDownload}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download MP3</span>
              </Button>
              <Button
                onClick={onReset}
                variant="ghost"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                Convert Another
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (downloadStatus?.status === "failed") {
    return (
      <div className="border-t border-gray-200 bg-red-50 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Conversion Failed</h3>
            <p className="text-sm text-gray-600 mb-4">
              {downloadStatus.errorMessage || "Unable to process this video. Please check the URL and try again."}
            </p>
            
            <Button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

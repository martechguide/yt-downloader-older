# YouTube MP3 Downloader - Architecture Guide

## Overview

This is a full-stack YouTube MP3 downloader application built with a modern web stack. The application allows users to paste YouTube URLs, preview video information, select audio quality, and download MP3 files. It features a clean, responsive UI with real-time progress tracking and professional styling.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with TypeScript support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Video Processing**: ytdl-core for YouTube video information and downloading
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Build Process**: ESBuild for production bundling

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: @neondatabase/serverless for serverless PostgreSQL

## Key Components

### Data Models
```typescript
// Download Request Schema
downloadRequests = {
  id: serial (primary key)
  youtubeUrl: text (required)
  quality: text (required) // "128", "192", "320" kbps
  status: text (default: "pending") // pending, processing, completed, failed
  videoTitle: text (nullable)
  videoDuration: text (nullable) 
  videoThumbnail: text (nullable)
  filePath: text (nullable)
  fileSize: integer (nullable)
  errorMessage: text (nullable)
  createdAt: timestamp (auto)
  completedAt: timestamp (nullable)
}
```

### API Endpoints
- `POST /api/video-info` - Fetch YouTube video metadata
- `POST /api/download` - Initiate MP3 download process
- `GET /api/download/:id` - Check download status
- `GET /api/download/:id/file` - Serve completed MP3 file

### UI Components Structure
- **Converter**: Main download interface with URL input and quality selection
- **ProgressStates**: Dynamic progress tracking with different UI states
- **FeaturesSection**: Marketing content highlighting app benefits
- **InstructionsSection**: Step-by-step usage guide

### Storage Strategy
- **Development**: In-memory storage (MemStorage class)
- **Production**: PostgreSQL database storage
- **File Storage**: Local filesystem with configurable downloads directory

## Data Flow

### Download Process Flow
1. **URL Validation**: User enters YouTube URL, validated client and server-side
2. **Video Info Fetch**: Application fetches video metadata (title, duration, thumbnail)
3. **Quality Selection**: User selects audio quality (128/192/320 kbps)
4. **Download Initiation**: Backend starts ytdl-core processing
5. **Progress Tracking**: Client polls for status updates
6. **File Serving**: Completed MP3 served via download endpoint

### State Management Flow
- **Client State**: React Query manages API calls and caching
- **Server State**: Express sessions track user requests
- **Database State**: Drizzle ORM handles data persistence
- **File State**: Filesystem manages temporary and completed downloads

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **ytdl-core**: YouTube video downloading and info extraction
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible UI component primitives

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundler for production

### UI Component System
- **Shadcn/ui**: Pre-built accessible components
- **Class Variance Authority**: Component variant management
- **Tailwind Merge**: Conditional class merging utility

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets
2. **Backend Build**: ESBuild bundles Node.js server code
3. **Database Setup**: Drizzle pushes schema to PostgreSQL
4. **Asset Serving**: Express serves built frontend in production

### Environment Configuration
- **Development**: Local development with in-memory storage
- **Production**: PostgreSQL database with file-based downloads
- **Database URL**: Required environment variable for PostgreSQL connection

### Production Considerations
- File cleanup strategy for downloaded MP3s
- Rate limiting for download requests
- Error handling and user feedback
- CORS configuration for cross-origin requests

## Changelog
- June 29, 2025: Initial setup
- June 29, 2025: Fixed YouTube API issues by upgrading to @distube/ytdl-core
- June 29, 2025: Fixed JavaScript initialization error in converter component
- June 29, 2025: Fixed CSS import order for better compatibility
- June 29, 2025: Fixed query client URL building for proper download status polling
- June 29, 2025: Confirmed complete download workflow working with all quality options
- June 29, 2025: Implemented comprehensive ad system supporting multiple platforms
- June 29, 2025: Added support for Google AdSense, Media.net, Propeller Ads, PopAds, and custom ad codes
- June 29, 2025: Created flexible ad management with environment-based configuration

## User Preferences

Preferred communication style: Simple, everyday language.
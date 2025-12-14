# 🎯 CallInsight AI

<div align="center">

**Intelligent Sales Call Analysis with GPT-Audio-Mini and Whisper**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--Audio--Mini-green)](https://openai.com/)
[![Whisper](https://img.shields.io/badge/Whisper-API-orange)](https://openai.com/research/whisper)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Cache-red)](https://redis.io/)

</div>

---

## ⚠️ **PROJECT STATUS**

<div align="center">

**🚧 PROJECT UNDER CONSTRUCTION - NOT READY FOR PRODUCTION 🚧**

This project is under active development. Features may be incomplete, subject to change, or contain bugs. Use at your own risk.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Complete System Architecture](#-complete-system-architecture)
- [Feature Workflows](#-feature-workflows)
- [All Features](#-all-features)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Components](#-components)
- [Services & Hooks](#-services--hooks)
- [Database Schema](#-database-schema)
- [Technologies](#-technologies)
- [Installation & Setup](#-installation--setup)
- [Usage Examples](#-usage-examples)
- [API Costs](#-api-costs)

---

## 🎯 Overview

**CallInsight AI** is a sophisticated web application designed to provide real-time analysis and insights for sales calls. Built with Next.js and React, it leverages artificial intelligence to analyze conversation sentiment, engagement levels, and sales performance metrics with advanced audio processing capabilities.

The system transcribes audio using **Whisper API** and analyzes conversation content using **GPT-Audio-Mini**, providing real insights about sentiment, engagement, keywords, and specific recommendations.

### Core Capabilities:

✅ **Real-time audio recording** from microphone with Web Audio API visualization  
✅ **Live transcription** using Web Speech API (browser) or Whisper API (server)  
✅ **Automatic transcription** using Whisper API (OpenAI) for complete accuracy  
✅ **Complete content analysis** using GPT-Audio-Mini  
✅ **Real keyword extraction** mentioned in conversations  
✅ **Sentiment and engagement analysis** based on actual content  
✅ **Objection detection** with suggested responses  
✅ **Competitor analysis** with counter-arguments  
✅ **Voice tone analysis** (emotions, speech rate, pauses)  
✅ **Sentiment by person** (salesperson vs customer)  
✅ **Call comparison** (side-by-side analysis)  
✅ **Training mode** with practice scenarios  
✅ **Real-time notifications** and alerts  
✅ **Advanced visualizations** (heatmaps, word clouds, timelines)  
✅ **Advanced search** with multiple filters  
✅ **Collaboration features** (sharing, comments, @mentions)  
✅ **Dark mode** support  
✅ **Analytics dashboard** with charts and metrics  
✅ **Performance dashboard** with trends and achievements  
✅ **Report export** in multiple formats (PDF, HTML, JSON, CSV, TXT)  
✅ **Database persistence** with PostgreSQL  
✅ **Caching** with Redis  
✅ **Background processing** with BullMQ queues  
✅ **Rate limiting** and security  
✅ **Advanced emotion analysis** (joy, frustration, anxiety, confidence)  
✅ **Silence analysis** (strategic pauses vs discomfort)  
✅ **Interruption detection** (who interrupts more)  
✅ **Tone analysis** (assertive, empathetic, defensive)  
✅ **Competitive keyword detection**  
✅ **Question vs statement ratio analysis**  
✅ **Closing detection** (attempts and success rate)  
✅ **Rapport analysis** (connection between salesperson and customer)  
✅ **Persuasion score** (storytelling, social proof, urgency, etc.)  
✅ **Interactive timeline** with highlight points  
✅ **Emotion heatmap** visualization  
✅ **Speech chart** (who speaks more and when)  
✅ **Audio compression** before upload  
✅ **Next steps generation** with AI  
✅ **Proposal generation** based on call analysis  

---

## 🏗️ Complete System Architecture

### Frontend Architecture

```mermaid
graph TB
    A["Main Dashboard<br/>index.tsx"] --> B["Live Analysis Tab"]
    A --> C["Recordings Tab"]
    A --> D["Analytics Tab"]
    A --> E["Performance Tab"]
    
    B --> B1["RealtimeTranscription"]
    B --> B2["MediaRecorder API"]
    B --> B3["Web Audio API"]
    B --> B4["TrainingMode"]
    
    C --> C1["Recording List"]
    C --> C2["AdvancedSearch"]
    C --> C3["ComparisonView"]
    
    D --> D1["AdvancedVisualizations"]
    D --> D2["InteractiveTimeline"]
    D --> D3["EmotionHeatmap"]
    D --> D4["SpeechChart"]
    D --> D5["Recharts"]
    
    E --> E1["Performance Metrics"]
    E --> E2["Achievements"]
    
    A --> F["NotificationSystem"]
    A --> G["DarkModeToggle"]
    A --> H["CollaborationFeatures"]
    
    classDef frontend fill:#06b6d4,stroke:#0891b2,color:#fff
    class A,B,C,D,E,B1,B2,B3,B4,C1,C2,C3,D1,D2,D3,D4,D5,E1,E2,F,G,H frontend
```

### Backend API Architecture

```mermaid
graph TB
    A["API Routes"] --> B["/api/transcribe<br/>Whisper API"]
    A --> C["/api/analyze<br/>GPT-Audio-Mini"]
    A --> D["/api/analyze-realtime<br/>Quick Analysis"]
    A --> E["/api/analyze-objections<br/>Objection Detection"]
    A --> F["/api/analyze-sentiment-by-person<br/>Person Analysis"]
    A --> G["/api/analyze-advanced<br/>Advanced Analysis"]
    A --> H["/api/generate-next-steps<br/>Next Steps & Proposals"]
    A --> I["/api/auth/[...nextauth]<br/>Authentication"]
    
    B --> B1["audioAnalysis.ts"]
    C --> B1
    D --> B1
    E --> E1["objectionAnalysis.ts"]
    F --> F1["sentimentByPerson.ts"]
    G --> G1["advancedAnalysis.ts"]
    H --> H1["nextStepsGenerator.ts"]
    
    B1 --> J["Redis Cache"]
    E1 --> J
    F1 --> J
    G1 --> J
    H1 --> J
    
    B1 --> K["Audio Compression<br/>utils/audioCompression.ts"]
    
    classDef api fill:#10b981,stroke:#059669,color:#fff
    classDef service fill:#8b5cf6,stroke:#7c3aed,color:#fff
    class A,B,C,D,E,F,G,H,I api
    class B1,E1,F1,G1,H1,J,K service
```

### Database & Storage Architecture

```mermaid
graph TB
    A["PostgreSQL<br/>Prisma ORM"] --> B["Users Table"]
    A --> C["Recordings Table"]
    A --> D["Comments Table"]
    A --> E["SharedRecordings Table"]
    A --> F["Accounts Table"]
    A --> G["Sessions Table"]
    
    H["Redis Cache"] --> H1["Transcription Cache<br/>7 days TTL"]
    H --> H2["Analysis Cache<br/>30 days TTL"]
    H --> H3["BullMQ Queue"]
    
    I["localStorage<br/>Fallback"] --> I1["Recordings<br/>Base64"]
    I --> I2["User Preferences"]
    
    classDef database fill:#8b5cf6,stroke:#7c3aed,color:#fff
    classDef cache fill:#f59e0b,stroke:#d97706,color:#fff
    class A,B,C,D,E,F,G database
    class H,H1,H2,H3,I,I1,I2 cache
```

### OpenAI Services Integration

```mermaid
graph LR
    A["Frontend Request"] --> B["API Route"]
    B --> C["Service Layer"]
    C --> D["OpenAI API"]
    
    D --> D1["Whisper API<br/>Transcription"]
    D --> D2["GPT-Audio-Mini<br/>Content Analysis"]
    D --> D3["GPT-Audio-Mini<br/>Objection Analysis"]
    D --> D4["GPT-Audio-Mini<br/>Sentiment Analysis"]
    D --> D5["GPT-Audio-Mini<br/>Advanced Analysis"]
    D --> D6["GPT-Audio-Mini<br/>Next Steps Generation"]
    
    D1 --> E["Cache Result"]
    D2 --> E
    D3 --> E
    D4 --> E
    D5 --> E
    D6 --> E
    
    E --> F["Return to Frontend"]
    
    classDef openai fill:#00a67e,stroke:#008f6b,color:#fff
    class D,D1,D2,D3,D4,D5,D6 openai
```

---

## 🔄 Feature Workflows

### 1. Recording Flow (Simplified)

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend
    participant MR as MediaRecorder
    participant WA as Web Audio API
    
    U->>UI: Start Recording
    UI->>MR: Initialize
    UI->>WA: Start Analysis
    WA-->>UI: Audio Metrics
    MR-->>UI: Audio Blob
    U->>UI: Stop Recording
    UI->>UI: Save to Storage
```

### 2. Transcription Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant API as API Route
    participant Cache as Redis
    participant W as Whisper API
    
    UI->>API: POST /api/transcribe
    API->>Cache: Check Cache
    alt Cache Hit
        Cache-->>API: Cached Result
    else Cache Miss
        API->>W: Send Audio
        W-->>API: Transcription
        API->>Cache: Save (7 days)
    end
    API-->>UI: Return Transcription
```

### 3. Analysis Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant API as API Route
    participant Cache as Redis
    participant GPT as GPT-Audio-Mini
    
    UI->>API: POST /api/analyze
    API->>Cache: Check Cache
    alt Cache Hit
        Cache-->>API: Cached Analysis
    else Cache Miss
        API->>GPT: Send Transcription
        GPT-->>API: Complete Analysis
        API->>Cache: Save (30 days)
    end
    API-->>UI: Return Analysis
```

### 4. Real-time Transcription Flow

```mermaid
graph LR
    A["Start Recording"] --> B["Web Speech API"]
    B --> C["Interim Results"]
    B --> D["Final Results"]
    C --> E["Display Live"]
    D --> F["Accumulate Text"]
    E --> G["Keyword Highlight"]
    F --> G
```

### 5. Comparison Analysis Flow

```mermaid
graph TD
    A["Select Recordings"] --> B["Fetch Data"]
    B --> C["Calculate Averages"]
    C --> D["Generate Charts"]
    D --> E["Display Results"]
```

### 6. Objection Analysis Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant API as API Route
    participant GPT as GPT-Audio-Mini
    
    UI->>API: POST /api/analyze-objections
    API->>GPT: Send Transcription
    GPT-->>API: Objections + Suggestions
    API-->>UI: Return Analysis
```

### 7. Background Processing Flow

```mermaid
graph LR
    A["Request"] --> B["Queue Job"]
    B --> C["Process"]
    C --> D["Save Results"]
    D --> E["Notify User"]
```

### 8. Collaboration Flow

```mermaid
graph LR
    A["Share"] --> B["Set Permission"]
    B --> C["Save"]
    C --> D["Notify"]
    D --> E["Access"]
    E --> F["Comment"]
```

### 9. Advanced Analysis Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant API as API Route
    participant GPT as GPT-Audio-Mini
    participant Cache as Redis
    
    UI->>API: POST /api/analyze-advanced
    API->>Cache: Check Cache
    alt Cache Hit
        Cache-->>API: Cached Analysis
    else Cache Miss
        API->>GPT: Send Transcription<br/>+ Advanced Prompt
        GPT-->>API: Complete Advanced Analysis:<br/>- Emotions<br/>- Silences<br/>- Interruptions<br/>- Tone<br/>- Rapport<br/>- Persuasion Score
        API->>Cache: Save (30 days)
    end
    API-->>UI: Return Advanced Analysis
    UI->>UI: Display Visualizations:<br/>- Timeline<br/>- Heatmap<br/>- Speech Chart
```

### 10. Next Steps Generation Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant API as API Route
    participant GPT as GPT-Audio-Mini
    
    UI->>API: POST /api/generate-next-steps<br/>(transcription + analysis)
    API->>GPT: Generate Next Steps:<br/>- Immediate actions<br/>- Short-term<br/>- Long-term<br/>- Follow-up email<br/>- Proposal outline
    GPT-->>API: Next Steps JSON
    API-->>UI: Return Next Steps
    UI->>UI: Display Actions<br/>& Generate Proposal
```

### 11. Audio Compression Flow

```mermaid
graph LR
    A["Audio Blob<br/>Original"] --> B["Compress Audio<br/>Web Audio API"]
    B --> C["MediaRecorder<br/>Additional Compression"]
    C --> D["Compressed Blob<br/>Smaller Size"]
    D --> E["Upload to Server"]
    E --> F["Transcribe & Analyze"]
    
    style A fill:#f59e0b,color:#fff
    style D fill:#10b981,color:#fff
```

### 12. Real-time Analysis Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend
    participant WS as Web Speech API
    participant API as API Route
    participant GPT as GPT-Audio-Mini
    
    U->>UI: Start Recording
    UI->>WS: Start Transcription
    WS-->>UI: Live Transcription (every 10s)
    UI->>API: POST /api/analyze-realtime
    API->>GPT: Quick Analysis
    GPT-->>API: Sentiment + Engagement + Suggestion
    API-->>UI: Return Quick Analysis
    UI->>UI: Update Live Insights
    Note over UI: Display:<br/>- Sentiment Bar<br/>- Engagement Bar<br/>- AI Suggestions
```

### 13. Sentiment by Person Flow

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant API as API Route
    participant GPT as GPT-Audio-Mini
    
    UI->>API: POST /api/analyze-sentiment-by-person<br/>(transcription)
    API->>GPT: Analyze Sentiment:<br/>- Salesperson<br/>- Customer
    GPT-->>API: Sentiment Scores:<br/>- salespersonSentiment<br/>- customerSentiment<br/>- overallInteractionTone
    API-->>UI: Return Person Sentiment
    UI->>UI: Display Separate Charts
```

### 14. Advanced Search Flow

```mermaid
graph TD
    A["User Opens Search"] --> B["Enter Search Terms"]
    B --> C["Apply Filters:<br/>- Sentiment Range<br/>- Engagement Range<br/>- Duration<br/>- Date Range<br/>- Keywords"]
    C --> D["Search Recordings"]
    D --> E["Filter Results"]
    E --> F["Display Matching Recordings"]
    F --> G["User Selects Recording"]
    G --> H["Show Details"]
```

### 15. Export Report Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend
    participant Gen as Report Generator
    
    U->>UI: Click Export Button
    UI->>U: Select Format:<br/>PDF, HTML, JSON, CSV, TXT
    U->>UI: Choose Format
    UI->>Gen: Generate Report:<br/>- Analytics Data<br/>- Performance Data<br/>- Selected Recordings
    Gen->>Gen: Format Data
    Gen-->>UI: Return Formatted Report
    UI->>U: Download File
```

### 16. Training Mode Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend
    participant TM as TrainingMode
    participant MR as MediaRecorder
    
    U->>UI: Select Training Scenario
    UI->>TM: Load Scenario:<br/>- Price Objection<br/>- Timeline Objection<br/>- Competitor Mention<br/>- Closing
    TM-->>UI: Display Scenario Script
    U->>UI: Start Practice Recording
    UI->>MR: Record Practice Call
    MR-->>UI: Audio Blob
    UI->>UI: Analyze Practice Call
    UI->>U: Show Feedback & Tips
```

---

## ✨ All Features

### 🎙️ Live Call Analysis

- **Real-time Recording**: Start/stop call recording with visual feedback and audio level indicators (20-bar spectrum)
- **Live Transcription**: Web Speech API provides real-time transcription during recording (Chrome/Edge only)
- **Live Sentiment Analysis**: Monitor conversation sentiment in real-time using Web Audio API metrics (energy, clarity, consistency)
- **Engagement Tracking**: Track customer engagement levels throughout the call with dynamic scoring
- **AI-Powered Suggestions**: Receive live coaching tips and recommendations based on voice patterns and audio metrics
- **Audio Visualization**: Real-time audio level bars with responsive animations
- **Session Metrics**: Track peak moments, voice activity, and energy levels
- **Training Mode**: Practice scenarios with roleplay functionality and immediate feedback

### 📊 Analytics Dashboard

- **Sentiment & Engagement Charts**: Visual representation of conversation flow with real-time data from GPT analysis
- **Performance Radar**: Multi-dimensional performance metrics visualization (5 dimensions)
- **Keyword Analysis**: Track important topics and their sentiment impact from actual recordings (real keywords extracted by GPT)
- **Weekly Overview**: Comprehensive call statistics and conversion tracking (last 7 days)
- **Selective Analysis**: Choose specific recordings to analyze and compare
- **Real-time Data Integration**: Analytics reflect actual AI analysis from recorded sessions
- **Advanced Visualizations**: 
  - Sentiment heatmaps showing intensity over time
  - Keyword word clouds showing most mentioned terms
  - Interactive timeline with sentiment/engagement bars
  - Emotion heatmap visualization (separate for salesperson and customer)
  - Interactive timeline advanced with highlight points (emotions, silences, interruptions, closings)
  - Speech chart showing who speaks more and when, with interruption tracking
- **Next Steps Display**: AI-generated immediate actions, short-term and long-term steps
- **Follow-up Email Generation**: Auto-generated email subject and body
- **Proposal Outline**: Complete proposal structure with sections and key points
- **Advanced Analysis Summary**: 
  - Persuasion score breakdown (storytelling, social proof, urgency, etc.)
  - Rapport score with trend analysis
  - Closing analysis (attempts, successes, rate)
  - Interruption analysis (salesperson vs customer)

### 📈 Performance Dashboard

- **Overall Performance Score**: Comprehensive scoring based on multiple metrics (sentiment 40% + engagement 40% + activity 20%)
- **Skills Breakdown**: Detailed analysis of Communication, Engagement, Consistency, Duration, and Frequency
- **7-Day Trend Analysis**: Performance tracking over time with visual charts
- **Achievement System**: Milestone tracking with badges for accomplishments
- **AI Recommendations**: Personalized suggestions with priority levels (High, Medium, Low)
- **Progress Tracking**: Current vs. target comparisons with improvement indicators

### 🎯 Recording Management

- **Smart Recording Storage**: Automatic saving with AI analysis data (PostgreSQL or localStorage fallback)
- **Selective Analytics**: Choose which recordings to analyze
- **Progress Tracking**: Real-time analysis progress with visual feedback
- **Recording Metadata**: Duration, date, sentiment scores, and AI analysis status
- **Batch Processing**: Analyze multiple recordings sequentially (queue system available for server-side processing)
- **Advanced Search**: Full-text search in transcriptions with multiple filters (sentiment, engagement, duration, date, keywords)
- **Call Comparison**: Compare up to 5 recordings side-by-side with comparative charts
- **Tags & Categories**: Database schema supports tags and categories (demo, follow-up, closing, training) - UI implementation pending
- **Recording Actions**: Play, download, share, collaborate, and delete recordings
- **Storage Management**: Automatic cleanup of old recordings, storage usage display
- **Audio Playback**: Built-in audio player for each recording

### 🤖 Advanced AI Features

- **Objection Detection**: Automatically detect and categorize objections (price, timeline, product, competitor, authority)
- **Objection Type Analysis**: Detailed breakdown of objections by type (price, timing, authority, need, product, other) with examples
- **Competitor Analysis**: Detect competitor mentions and suggest counter-arguments
- **Sentiment by Person**: Separate sentiment analysis for salesperson vs customer
- **Tension Detection**: Identify moments of tension in conversations
- **Approach Suggestions**: Get suggestions on when to change sales approach
- **Voice Tone Analysis**: Detect emotions (happy, frustrated, neutral, excited, calm, anxious)
- **Speech Rate Analysis**: Calculate words per minute
- **Pause Detection**: Count pauses and calculate average pause duration
- **Advanced Emotion Analysis**: Detect specific emotions (joy, frustration, anxiety, confidence) with intensity scores and timeline
- **Silence Analysis**: Distinguish between strategic pauses vs uncomfortable silences with duration and context
- **Interruption Detection**: Track who interrupts more (salesperson vs customer) with timestamps and context
- **Tone Analysis**: Analyze tone profiles (assertive, empathetic, defensive) for both speakers
- **Competitive Keyword Detection**: Identify competitive keywords and competitor mentions with sentiment analysis
- **Question vs Statement Ratio**: Calculate ratio of questions to affirmations for both speakers
- **Closing Detection**: Track closing attempts with success rate and timestamps
- **Rapport Analysis**: Measure connection score between salesperson and customer with trend analysis
- **Persuasion Score**: Comprehensive scoring based on storytelling, social proof, urgency, reciprocity, authority, and consistency

### 👥 Collaboration Features

- **Share Recordings**: Share recordings with team members
- **Comments System**: Add comments to recordings with @mentions
- **Permission Levels**: Control access (view, comment, edit)
- **Team Collaboration**: Work together on call analysis
- **@Mentions**: Mention team members in comments for notifications
- **Shared Recordings**: Access recordings shared by team members

### 🎨 User Experience

- **Dark Mode**: Toggle between light and dark themes with system preference detection
- **Real-time Notifications**: Alert system during recording and post-call insights
- **Recording Alerts**: Automatic alerts for low audio, low sentiment, and other issues during recording
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Framer Motion animations throughout
- **Audio Level Visualization**: Real-time 20-bar audio spectrum visualization
- **Microphone Testing**: Test microphone before recording

### 📄 Export & Reports

- **PDF Export**: Generate PDF reports (opens print dialog)
- **HTML Export**: Complete styled HTML reports
- **JSON Export**: Structured data export
- **CSV Export**: Spreadsheet-compatible format
- **TXT Export**: Simple text reports
- **Report Types**: Analytics reports and Performance reports available
- **Selective Export**: Export data for selected recordings only

---

## 📁 Project Structure

```
callinsight-ai/
├── components/                    # React Components
│   ├── AdvancedSearch.tsx         # Advanced search with filters
│   ├── AdvancedVisualizations.tsx # Heatmaps, word clouds, timeline
│   ├── CollaborationFeatures.tsx  # Sharing and comments
│   ├── ComparisonView.tsx         # Call comparison
│   ├── DarkModeToggle.tsx         # Theme toggle
│   ├── NotificationSystem.tsx    # Notification system
│   ├── RealtimeTranscription.tsx # Live transcription
│   ├── TrainingMode.tsx           # Training/roleplay mode
│   ├── InteractiveTimeline.tsx    # Interactive timeline with highlight points
│   ├── EmotionHeatmap.tsx         # Emotion heatmap visualization
│   └── SpeechChart.tsx            # Speech distribution chart
│
├── hooks/                         # Custom React Hooks
│   ├── useAuth.ts                 # Authentication hook
│   ├── useDarkMode.ts             # Dark mode hook
│   └── useRealtimeTranscription.ts # Real-time transcription hook
│
├── lib/                           # Library Files
│   ├── prisma.ts                  # Prisma client
│   ├── queue.ts                   # BullMQ queue system
│   ├── rateLimit.ts               # Rate limiting
│   └── redis.ts                   # Redis client
│
├── pages/
│   ├── api/                       # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth].ts   # NextAuth authentication
│   │   ├── analyze.ts             # Main analysis endpoint
│   │   ├── analyze-objections.ts  # Objection analysis
│   │   ├── analyze-realtime.ts    # Quick real-time analysis
│   │   ├── analyze-sentiment-by-person.ts # Person sentiment
│   │   ├── analyze-advanced.ts    # Advanced analysis (emotions, silences, etc.)
│   │   ├── generate-next-steps.ts # Next steps and proposal generation
│   │   └── transcribe.ts          # Whisper transcription
│   │
│   ├── _app.tsx                   # App wrapper
│   ├── checkout.tsx               # Checkout page (simulated)
│   ├── index.tsx                  # Main dashboard (4 tabs)
│   └── login.tsx                  # Login page
│
├── prisma/
│   └── schema.prisma              # Database schema
│
├── services/                      # Business Logic Services
│   ├── audioAnalysis.ts           # Audio processing with cache
│   ├── objectionAnalysis.ts       # Objection detection
│   ├── sentimentByPerson.ts       # Person-specific sentiment
│   ├── voiceAnalysis.ts          # Voice tone analysis
│   ├── advancedAnalysis.ts        # Advanced analysis (emotions, silences, interruptions, etc.)
│   └── nextStepsGenerator.ts      # Next steps and proposal generation
│
├── utils/                         # Utility Functions
│   └── audioCompression.ts        # Audio compression before upload
│
├── styles/
│   └── globals.css                # Global styles
│
├── public/                        # Static files
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   └── manifest.json
│
├── .env.local                     # Environment variables (DO NOT COMMIT)
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

#### `POST /api/auth/[...nextauth]`
- **Purpose**: NextAuth.js authentication handler
- **Features**: JWT sessions, password hashing, user management
- **Methods**: GET, POST (signin, signout, callback)
- **Security**: bcrypt password hashing, JWT tokens, session management
- **Database**: Uses Prisma adapter with PostgreSQL

### Audio Processing

#### `POST /api/transcribe`
- **Purpose**: Transcribe audio using Whisper API
- **Input**: FormData with audio file (max 25MB)
- **Output**: 
  ```json
  {
    "text": "transcription text",
    "language": "pt",
    "duration": 120.5,
    "segments": [...]
  }
  ```
- **Caching**: Redis cache (7 days TTL)
- **Rate Limit**: 20 requests/hour per IP
- **Error Handling**: File cleanup on error, detailed error messages

#### `POST /api/analyze`
- **Purpose**: Complete analysis using GPT-Audio-Mini
- **Input**: 
  ```json
  {
    "transcription": "full transcription text",
    "duration": 120
  }
  ```
- **Output**: 
  ```json
  {
    "sentiment": 0.75,
    "engagement": 0.82,
    "keywords": ["preço", "desconto", "produto"],
    "summary": "Resumo da ligação...",
    "positivePoints": [...],
    "improvementAreas": [...],
    "sentimentAnalysis": {...},
    "engagementMetrics": {...},
    "salesIndicators": {...},
    "recommendations": [...],
    "realTimeData": [...],
    "analyzedAt": "2024-01-01T00:00:00Z"
  }
  ```
- **Caching**: Redis cache (30 days TTL)
- **Rate Limit**: 50 requests/hour per IP
- **Model**: GPT-Audio-Mini with JSON response format

#### `POST /api/analyze-realtime`
- **Purpose**: Quick real-time analysis during recording
- **Input**: 
  ```json
  {
    "transcription": "partial transcription (min 20 chars)",
    "currentTime": 45
  }
  ```
- **Output**: 
  ```json
  {
    "sentiment": 0.65,
    "engagement": 0.70,
    "keywords": ["palavra1", "palavra2"],
    "suggestion": "Sugestão rápida",
    "time": 45
  }
  ```
- **Rate Limit**: 100 requests/hour per IP
- **Optimization**: Lower token limit (200), faster response

### Advanced Analysis

#### `POST /api/analyze-objections`
- **Purpose**: Detect objections and competitor mentions
- **Input**: 
  ```json
  {
    "transcription": "full transcription text"
  }
  ```
- **Output**: 
  ```json
  {
    "objections": [
      {
        "type": "price" | "timeline" | "product" | "competitor" | "authority" | "other",
        "text": "exact quote from transcription",
        "severity": "low" | "medium" | "high",
        "suggestedResponse": "suggested response text"
      }
    ],
    "competitorMentions": [
      {
        "competitor": "competitor name",
        "context": "what was said",
        "suggestedCounter": "counter-argument"
      }
    ],
    "overallObjectionLevel": "low" | "medium" | "high"
  }
  ```
- **Rate Limit**: 30 requests/hour per IP
- **Model**: GPT-Audio-Mini

#### `POST /api/analyze-sentiment-by-person`
- **Purpose**: Separate sentiment for salesperson vs customer
- **Input**: 
  ```json
  {
    "transcription": "full transcription text"
  }
  ```
- **Output**:
  ```json
  {
    "salesperson": {
      "sentiment": 0.8,
      "tone": "positive" | "neutral" | "negative" | "assertive" | "empathetic",
      "keyPhrases": ["phrase1", "phrase2"]
    },
    "customer": {
      "sentiment": 0.6,
      "tone": "positive" | "neutral" | "negative" | "hesitant" | "demanding",
      "keyPhrases": ["phrase1", "phrase2"]
    },
    "tensionMoments": [
      {
        "time": "0:30",
        "description": "moment description",
        "severity": "low" | "medium" | "high"
      }
    ],
    "overallInteractionTone": "collaborative" | "neutral" | "confrontational",
    "recommendations": ["rec1", "rec2"]
  }
  ```
- **Rate Limit**: 30 requests/hour per IP
- **Model**: GPT-Audio-Mini

#### `POST /api/analyze-advanced`
- **Purpose**: Complete advanced analysis with emotions, silences, interruptions, tone, rapport, and persuasion
- **Input**: 
  ```json
  {
    "transcription": "full transcription text",
    "duration": 300,
    "segments": [
      {
        "start": 0,
        "end": 30,
        "text": "segment text"
      }
    ]
  }
  ```
- **Output**: Complete advanced analysis JSON (see `services/advancedAnalysis.ts` for full structure)
- **Rate Limit**: 20 requests/hour per IP
- **Model**: GPT-Audio-Mini
- **Caching**: Redis cache (30 days TTL)

#### `POST /api/generate-next-steps`
- **Purpose**: Generate next steps, follow-up email, and proposal outline based on call analysis
- **Input**: 
  ```json
  {
    "transcription": "full transcription text",
    "analysis": {
      "sentiment": 0.75,
      "engagement": 0.82,
      "salesIndicators": {...}
    },
    "customerInfo": {
      "name": "string",
      "company": "string",
      "painPoints": ["string"]
    }
  }
  ```
- **Output**: 
  ```json
  {
    "immediate": [...],
    "shortTerm": [...],
    "longTerm": [...],
    "followUpEmail": {
      "subject": "string",
      "body": "string",
      "tone": "professional" | "friendly" | "urgent" | "casual"
    },
    "proposalOutline": {
      "title": "string",
      "sections": [...],
      "keyPoints": ["string"],
      "pricingRecommendation": "string"
    }
  }
  ```
- **Rate Limit**: 30 requests/hour per IP
- **Model**: GPT-Audio-Mini

---

## 🧩 Components

### `RealtimeTranscription`
- **Purpose**: Live transcription during recording
- **Features**: Web Speech API, keyword highlighting, word count
- **Props**: `isRecording`, `onTranscriptionChange`, `language`
- **Browser Support**: Chrome, Edge (Web Speech API)

### `ComparisonView`
- **Purpose**: Compare multiple recordings side-by-side
- **Features**: Up to 5 recordings, comparative charts, trend analysis
- **Props**: `recordings: Recording[]`
- **Charts**: Line chart, radar chart, trend indicators

### `NotificationSystem`
- **Purpose**: Real-time notifications and alerts
- **Features**: Multiple types (success, error, info, warning, alert), auto-dismiss, actions
- **Usage**: Wrap app with `NotificationProvider`, use `useNotifications()` hook
- **Recording Alerts**: Automatic alerts during recording (low audio, low sentiment, etc.)

### `DarkModeToggle`
- **Purpose**: Toggle between light/dark themes
- **Features**: System preference detection, persistent storage
- **Usage**: Add to header/navigation

### `AdvancedSearch`
- **Purpose**: Advanced search with multiple filters
- **Features**: Full-text search, sentiment range, engagement range, duration, date range, keyword filtering
- **Props**: `recordings`, `onSelect`
- **Output**: Filtered recordings list

### `AdvancedVisualizations`
- **Components**:
  - `SentimentHeatmap`: Visual heatmap of sentiment over time
  - `KeywordWordCloud`: Word cloud of most mentioned keywords
  - `InteractiveTimeline`: Interactive timeline with sentiment/engagement bars

### `TrainingMode`
- **Purpose**: Practice scenarios without real customers
- **Features**: 4 built-in scenarios (price objection, timeline, competitor, closing), scenario scripts, practice mode
- **Props**: `onStart`, `onStop`, `isRecording`, `scenario`

### `CollaborationFeatures`
- **Purpose**: Team collaboration on recordings
- **Features**: Share recordings, comments with @mentions, permission levels
- **Props**: `recordingId`, `comments`, `onAddComment`, `onShare`

---

## 🔧 Services & Hooks

### Services

#### `services/audioAnalysis.ts`
- **`transcribeAudio(blob: Blob): Promise<TranscriptionResult>`**
  - Transcribes audio using Whisper API
  - Handles FormData creation and file upload
  - Returns transcription with language, duration, segments
  - Error handling with detailed messages

- **`analyzeTranscription(text: string, duration: number): Promise<AnalysisResult>`**
  - Analyzes transcription using GPT-Audio-Mini
  - Returns complete analysis with sentiment, engagement, keywords, recommendations
  - Includes real-time data simulation based on analysis

- **`processAudioComplete(blob: Blob, duration: number): Promise<{transcription, analysis}>`**
  - Orchestrates complete processing pipeline
  - First transcribes, then analyzes
  - Returns both transcription and analysis results
  - Can use queue system for background processing

#### `services/objectionAnalysis.ts`
- **`analyzeObjections(transcription: string): Promise<ObjectionAnalysis>`**
  - Detects objections in transcription
  - Categorizes by type (price, timeline, product, competitor, authority, other)
  - Provides severity levels and suggested responses
  - Detects competitor mentions with counter-arguments
  - Uses GPT-Audio-Mini with JSON response format

#### `services/sentimentByPerson.ts`
- **`analyzeSentimentByPerson(transcription: string): Promise<PersonSentiment>`**
  - Separates sentiment analysis for salesperson vs customer
  - Identifies tone for each person
  - Detects tension moments with timestamps
  - Provides overall interaction tone
  - Generates recommendations based on analysis
  - Uses GPT-Audio-Mini with JSON response format

#### `services/voiceAnalysis.ts`
- **`analyzeVoiceTone(audioMetrics, transcription, duration): VoiceAnalysisResult`**
  - Analyzes voice tone and emotions (neutral, happy, sad, angry, excited, calm, anxious)
  - Calculates speech rate (words per minute)
  - Detects pauses and filler words
  - Analyzes pitch (low, medium, high) and volume (soft, normal, loud)
  - Provides recommendations based on voice patterns
  - Uses Web Audio API metrics + transcription analysis

### Hooks

#### `hooks/useAuth.ts`
- `user`: Current user
- `login(userData)`: Login user
- `logout()`: Logout user
- `updateSubscription(plan)`: Update subscription
- `isSubscribed()`: Check if subscribed
- `canAccessFeature(feature)`: Check feature access

#### `hooks/useDarkMode.ts`
- `isDark`: Current theme state
- `toggle()`: Toggle theme

#### `hooks/useRealtimeTranscription.ts`
- `text`: Final transcription text
- `interimText`: Interim results
- `isListening`: Recording state
- `error`: Error message
- `start()`: Start transcription
- `stop()`: Stop transcription
- `reset()`: Reset transcription

---

## 📊 Data Structures & Types

### Recording Interface
```typescript
interface Recording {
  id: string
  name: string
  date: string // ISO string
  duration: number // seconds
  blob: string // Base64 encoded audio
  aiData?: {
    sentiment: number // 0-1
    engagement: number // 0-1
    keywords: string[]
    realTimeData: Array<{
      time: string // "MM:SS"
      sentiment: number
      engagement: number
    }>
    summary: string
    positivePoints: string[]
    improvementAreas: string[]
    sentimentAnalysis: {
      overall: "positive" | "neutral" | "negative"
      customerSentiment: number
      salespersonSentiment: number
    }
    engagementMetrics: {
      conversationFlow: number
      questionQuality: number
      listeningSkills: number
    }
    salesIndicators: {
      objections: string[]
      buyingSignals: string[]
      nextSteps: string
    }
    recommendations: string[]
    transcription?: string
    analyzedAt?: string
  }
}
```

### Analysis Result Types
```typescript
interface TranscriptionResult {
  text: string
  language: string
  duration: number
  segments: Array<{
    id: number
    seek: number
    start: number
    end: number
    text: string
    tokens: number[]
    temperature: number
    avg_logprob: number
    compression_ratio: number
    no_speech_prob: number
  }>
}

interface AnalysisResult {
  sentiment: number // 0-1
  engagement: number // 0-1
  keywords: string[]
  summary: string
  positivePoints: string[]
  improvementAreas: string[]
  sentimentAnalysis: {
    overall: "positive" | "neutral" | "negative"
    customerSentiment: number
    salespersonSentiment: number
  }
  engagementMetrics: {
    conversationFlow: number
    questionQuality: number
    listeningSkills: number
  }
  salesIndicators: {
    objections: string[]
    buyingSignals: string[]
    nextSteps: string
  }
  recommendations: string[]
  realTimeData: Array<{
    time: string
    sentiment: number
    engagement: number
  }>
  analyzedAt: string
}
```

### Session Metrics
```typescript
interface SessionMetrics {
  avgSentiment: number
  avgEngagement: number
  peakMoments: number
  totalWords: number
  energyLevel: number
}
```

### Analytics Data
```typescript
interface AnalyticsData {
  totalRecordings: number
  totalDuration: number // seconds
  avgSentiment: number
  avgEngagement: number
  topKeywords: Array<{
    word: string
    count: number
    sentiment: "positive" | "neutral" | "negative"
  }>
  weeklyStats: Array<{
    date: string
    recordings: number
    avgDuration: number
    sentiment: number
  }>
}
```

### Performance Data
```typescript
interface PerformanceData {
  overallScore: number // 0-100
  trendData: Array<{
    date: string
    score: number
    sentiment: number
    engagement: number
  }>
  skillsBreakdown: Array<{
    skill: string
    current: number
    target: number
    improvement: number
  }>
  achievements: Array<{
    title: string
    description: string
    date: string
    type: "milestone" | "improvement" | "streak"
  }>
  recommendations: Array<{
    title: string
    description: string
    priority: "high" | "medium" | "low"
    category: string
  }>
}
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    User ||--o{ Recording : creates
    User ||--o{ Comment : writes
    User ||--o{ SharedRecording : shares
    User ||--o{ Account : has
    User ||--o{ Session : has
    
    Recording ||--o{ Comment : has
    Recording ||--o{ SharedRecording : shared_via
    Recording ||--o{ AnalysisJob : processed_by
    
    User {
        string id PK
        string email UK
        string name
        string password
        string plan
        datetime createdAt
        datetime updatedAt
    }
    
    Recording {
        string id PK
        string userId FK
        string name
        int duration
        string audioUrl
        string transcription
        float sentiment
        float engagement
        string[] keywords
        string summary
        string[] positivePoints
        string[] improvementAreas
        string[] recommendations
        string[] objections
        string[] buyingSignals
        float customerSentiment
        float salespersonSentiment
        string voiceEmotion
        float speechRate
        int pauseCount
        json realTimeData
        string[] tags
        string category
        boolean isTraining
        datetime createdAt
        datetime analyzedAt
    }
    
    Comment {
        string id PK
        string recordingId FK
        string userId FK
        string content
        string[] mentions
        datetime createdAt
    }
    
    SharedRecording {
        string id PK
        string recordingId FK
        string userId FK
        string sharedWithUserId FK
        string permission
        datetime createdAt
    }
    
    AnalysisCache {
        string id PK
        string audioHash UK
        string transcription
        json analysis
        datetime expiresAt
    }
    
    AnalysisJob {
        string id PK
        string recordingId UK
        string status
        int progress
        string error
        datetime createdAt
        datetime completedAt
    }
```

---

## 🛠️ Technologies

### Frontend
- **Next.js 14.0.0** - React framework
- **React 18.2.0** - UI library
- **TypeScript 5.2.0** - Type safety
- **Tailwind CSS 3.3.0** - Styling
- **Framer Motion 10.16.4** - Animations
- **Recharts 2.8.0** - Charts
- **Lucide React** - Icons
- **react-wordcloud** - Word cloud visualization

### Backend
- **Next.js API Routes** - Server endpoints
- **NextAuth.js** - Authentication
- **Prisma** - ORM for PostgreSQL
- **BullMQ** - Queue system
- **Redis (ioredis)** - Caching
- **Express Rate Limit** - Rate limiting
- **Formidable** - File upload parsing
- **bcryptjs** - Password hashing

### External APIs
- **OpenAI Whisper API** - Audio transcription
- **OpenAI GPT-Audio-Mini** - Content analysis

### Database & Storage
- **PostgreSQL** - Primary database
- **Redis** - Cache and queues
- **localStorage** - Fallback storage (optional)

### Browser APIs
- **MediaRecorder API** - Audio recording
- **Web Audio API** - Real-time audio analysis
- **Web Speech API** - Real-time transcription (Chrome/Edge)

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- Redis 6+
- OpenAI API key

### Step 1: Clone and Install

   ```bash
   git clone <repository-url>
cd callinsight-ai
npm install
```

### Step 2: Set Up Database

```bash
# Create PostgreSQL database
createdb callinsight

# Run Prisma migrations
npm run db:migrate

# Generate Prisma Client
npm run db:generate
```

### Step 3: Start Redis

```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis

# Or Docker
docker run -d -p 6379:6379 redis
```

### Step 4: Configure Environment

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/callinsight?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# OpenAI
OPENAI_API_KEY=sk-your-api-key-here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

Generate NextAuth secret:
   ```bash
openssl rand -base64 32
   ```

### Step 5: Run Development Server

   ```bash
   npm run dev
   ```

Access at: `http://localhost:3000`

### Step 6: Login

Use demo credentials:
- **Email**: `demo@example.com`
- **Password**: `demo123`

Or create a new account.

---

## 💡 Usage Examples

### Example 1: Complete End-to-End Recording & Analysis Flow

**Scenario**: User records a sales call, transcribes it, and gets complete AI analysis.

```typescript
import { useState, useRef } from 'react'
import { processAudioComplete } from '../services/audioAnalysis'
import { useNotifications } from '../components/NotificationSystem'

function CompleteRecordingFlow() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [recording, setRecording] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const { showAlert } = useNotifications()

  // Step 1: Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        // Step 2: Create Blob from chunks
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        
        // Step 3: Save recording metadata
        const recordingData = {
          id: Date.now().toString(),
          name: `Gravação ${new Date().toLocaleString('pt-BR')}`,
          date: new Date().toISOString(),
          duration: currentTime,
          blob: blob
        }
        setRecording(recordingData)
        showAlert('Gravação salva! Iniciando análise...', 'info')

        // Step 4: Complete Analysis (Transcription + GPT Analysis)
        try {
          const { transcription, analysis } = await processAudioComplete(
            blob,
            currentTime
          )

          // Step 5: Update recording with analysis
          setRecording({
            ...recordingData,
            aiData: {
              sentiment: analysis.sentiment,
              engagement: analysis.engagement,
              keywords: analysis.keywords,
              summary: analysis.summary,
              recommendations: analysis.recommendations,
              transcription: transcription.text,
              realTimeData: analysis.realTimeData,
              analyzedAt: analysis.analyzedAt
            }
          })
          setAnalysis(analysis)
          showAlert('Análise completa!', 'success')
        } catch (error) {
          showAlert('Erro na análise: ' + error.message, 'error')
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setCurrentTime(0)
      
      // Timer
      const interval = setInterval(() => {
        setCurrentTime(prev => prev + 1)
      }, 1000)

      mediaRecorder.onstop = () => {
        clearInterval(interval)
        mediaRecorder.onstop()
      }
    } catch (error) {
      showAlert('Erro ao iniciar gravação: ' + error.message, 'error')
    }
  }

  // Step 6: Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Parar Gravação' : 'Iniciar Gravação'}
      </button>
      
      {isRecording && <p>Tempo: {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</p>}
      
      {analysis && (
        <div>
          <h3>Análise Completa</h3>
          <p>Sentimento: {(analysis.sentiment * 100).toFixed(0)}%</p>
          <p>Engajamento: {(analysis.engagement * 100).toFixed(0)}%</p>
          <p>Palavras-chave: {analysis.keywords.join(', ')}</p>
          <p>Resumo: {analysis.summary}</p>
          <ul>
            {analysis.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### Example 2: Complete API Call Flow (Frontend → Backend → OpenAI)

**Scenario**: Making a complete API call with error handling and caching.

```typescript
// Frontend: pages/index.tsx
async function analyzeRecording(blob: Blob, duration: number) {
  try {
    // Step 1: Transcribe Audio
    const formData = new FormData()
    const audioFile = new File([blob], 'audio.webm', { type: 'audio/webm' })
    formData.append('audio', audioFile)

    const transcribeResponse = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    })

    if (!transcribeResponse.ok) {
      const error = await transcribeResponse.json()
      throw new Error(error.error || 'Erro na transcrição')
    }

    const transcription = await transcribeResponse.json()
    // Response: { text: "...", language: "pt", duration: 120.5, segments: [...] }

    // Step 2: Analyze Transcription
    const analyzeResponse = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcription: transcription.text,
        duration: duration,
      }),
    })

    if (!analyzeResponse.ok) {
      const error = await analyzeResponse.json()
      throw new Error(error.error || 'Erro na análise')
    }

    const analysis = await analyzeResponse.json()
    // Response: { sentiment: 0.75, engagement: 0.82, keywords: [...], ... }

    return { transcription, analysis }
  } catch (error) {
    console.error('Erro completo:', error)
    throw error
  }
}

// Backend: pages/api/analyze.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transcription, duration } = req.body

    // Step 1: Check Cache (Redis)
    const cacheKey = `analysis:${hashTranscription(transcription)}`
    const cached = await redis.get(cacheKey)
    
    if (cached) {
      return res.status(200).json(JSON.parse(cached))
    }

    // Step 2: Call OpenAI GPT-Audio-Mini
    const completion = await openai.chat.completions.create({
      model: 'gpt-audio-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um analista especializado em chamadas de vendas...',
        },
        {
          role: 'user',
          content: `Analise esta transcrição: "${transcription}"`,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    // Step 3: Parse Response
    const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}')

    // Step 4: Cache Result (30 days)
    await redis.setex(cacheKey, 30 * 24 * 60 * 60, JSON.stringify(analysis))

    // Step 5: Return to Frontend
    return res.status(200).json(analysis)
  } catch (error: any) {
    return res.status(500).json({
      error: 'Erro ao analisar',
      details: error.message,
    })
  }
}
```

### Example 3: Real-time Analysis During Recording

**Scenario**: Get real-time AI feedback while recording.

```typescript
import { useState, useEffect } from 'react'
import { useRealtimeTranscription } from '../hooks/useRealtimeTranscription'

function RealtimeAnalysis() {
  const [isRecording, setIsRecording] = useState(false)
  const [realtimeAnalysis, setRealtimeAnalysis] = useState(null)
  const { text, start, stop } = useRealtimeTranscription('pt-BR')

  useEffect(() => {
    if (isRecording) {
      start()
    } else {
      stop()
    }
  }, [isRecording, start, stop])

  // Real-time Analysis every 15 seconds
  useEffect(() => {
    if (!isRecording || text.length < 100) return

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/analyze-realtime', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcription: text,
            currentTime: Date.now(),
          }),
        })

        const analysis = await response.json()
        // Response: { sentiment: 0.65, engagement: 0.70, keywords: [...], suggestion: "..." }
        
        setRealtimeAnalysis(analysis)
      } catch (error) {
        console.error('Erro na análise em tempo real:', error)
      }
    }, 15000) // Every 15 seconds

    return () => clearInterval(interval)
  }, [isRecording, text])

  return (
    <div>
      <button onClick={() => setIsRecording(!isRecording)}>
        {isRecording ? 'Parar' : 'Gravar'}
      </button>

      {text && (
        <div>
          <h3>Transcrição ao Vivo</h3>
          <p>{text}</p>
        </div>
      )}

      {realtimeAnalysis && (
        <div>
          <h3>Análise em Tempo Real</h3>
          <p>Sentimento: {(realtimeAnalysis.sentiment * 100).toFixed(0)}%</p>
          <p>Engajamento: {(realtimeAnalysis.engagement * 100).toFixed(0)}%</p>
          <p>Sugestão: {realtimeAnalysis.suggestion}</p>
        </div>
      )}
    </div>
  )
}
```

### Example 4: Complete Objection Analysis Flow

**Scenario**: Analyze a recording for objections and get suggested responses.

```typescript
async function analyzeObjections(transcription: string) {
  try {
    // Step 1: Call Objection Analysis API
    const response = await fetch('/api/analyze-objections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcription }),
    })

    if (!response.ok) {
      throw new Error('Erro na análise de objeções')
    }

    const result = await response.json()
    /*
    Response:
    {
      "objections": [
        {
          "type": "price",
          "text": "O preço está muito alto",
          "severity": "high",
          "suggestedResponse": "Entendo sua preocupação com o preço..."
        }
      ],
      "competitorMentions": [
        {
          "competitor": "Concorrente X",
          "context": "Cliente mencionou que usa Concorrente X",
          "suggestedCounter": "Nossa solução oferece..."
        }
      ],
      "overallObjectionLevel": "medium"
    }
    */

    // Step 2: Display Results
    result.objections.forEach((obj: any) => {
      console.log(`Objeção ${obj.type}: ${obj.text}`)
      console.log(`Severidade: ${obj.severity}`)
      console.log(`Sugestão: ${obj.suggestedResponse}`)
    })

    return result
  } catch (error) {
    console.error('Erro:', error)
    throw error
  }
}
```

### Example 5: Complete Data Flow with Database

**Scenario**: Save recording to database with all analysis data.

```typescript
import { prisma } from '../lib/prisma'

async function saveRecordingToDatabase(
  userId: string,
  recording: {
    name: string
    duration: number
    blob: string // Base64
    aiData: any
  }
) {
  try {
    // Step 1: Save to PostgreSQL via Prisma
    const savedRecording = await prisma.recording.create({
      data: {
        userId: userId,
        name: recording.name,
        date: new Date(),
        duration: recording.duration,
        blob: recording.blob, // Base64 encoded
        aiData: recording.aiData, // JSON field
        needsAnalysis: false,
      },
    })

    // Step 2: Cache transcription in Redis
    if (recording.aiData?.transcription) {
      await redis.setex(
        `transcription:${savedRecording.id}`,
        7 * 24 * 60 * 60, // 7 days
        recording.aiData.transcription
      )
    }

    // Step 3: Cache analysis in Redis
    await redis.setex(
      `analysis:${savedRecording.id}`,
      30 * 24 * 60 * 60, // 30 days
      JSON.stringify(recording.aiData)
    )

    return savedRecording
  } catch (error) {
    console.error('Erro ao salvar:', error)
    throw error
  }
}

// Usage
const recording = {
  name: 'Chamada com Cliente X',
  duration: 300, // 5 minutes
  blob: base64Audio,
  aiData: {
    sentiment: 0.75,
    engagement: 0.82,
    keywords: ['preço', 'desconto', 'produto'],
    summary: 'Chamada produtiva sobre preços...',
    transcription: 'Transcrição completa...',
    // ... more fields
  },
}

const saved = await saveRecordingToDatabase(userId, recording)
console.log('Gravado salvo com ID:', saved.id)
```

### Example 6: Complete Component Integration

**Scenario**: Full component integration with all features.

```typescript
import { useState } from 'react'
import RealtimeTranscription from '../components/RealtimeTranscription'
import ComparisonView from '../components/ComparisonView'
import AdvancedSearch from '../components/AdvancedSearch'
import { NotificationProvider, useNotifications } from '../components/NotificationSystem'
import TrainingMode from '../components/TrainingMode'

function CompleteDashboard() {
  const [recordings, setRecordings] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [selectedRecordings, setSelectedRecordings] = useState([])
  const { showAlert } = useNotifications()

  return (
    <NotificationProvider>
      <div>
        {/* Recording Section */}
        <section>
          <TrainingMode
            onStart={() => setIsRecording(true)}
            onStop={() => setIsRecording(false)}
            isRecording={isRecording}
          />
          
          {isRecording && (
            <RealtimeTranscription
              isRecording={isRecording}
              onTranscriptionChange={(text) => {
                console.log('Transcrição:', text)
              }}
            />
          )}
        </section>

        {/* Search Section */}
        <section>
          <AdvancedSearch
            recordings={recordings}
            onFilter={(filtered) => {
              setSelectedRecordings(filtered.map(r => r.id))
            }}
          />
        </section>

        {/* Comparison Section */}
        {selectedRecordings.length > 1 && (
          <section>
            <ComparisonView
              recordings={recordings.filter(r => selectedRecordings.includes(r.id))}
              onClose={() => setSelectedRecordings([])}
            />
          </section>
        )}
      </div>
    </NotificationProvider>
  )
}
```

---

## 💰 API Costs

### Whisper API
- **Cost**: ~$0.006 per minute
- **Example**: 10-minute call = $0.06

### GPT-Audio-Mini
- **Cost**: $0.60 per 1M input tokens, $2.40 per 1M output tokens
- **Example**: 500-word transcription ≈ $0.0004

### Total Cost per Call
- **10-minute call**: ~$0.06 (transcription) + ~$0.0004 (analysis) = **~$0.06**

**💡 Caching reduces costs significantly** - Repeated analyses use cached results!

---

## 📊 Complete Feature Matrix

| Feature | Status | Technology | Real/Fake |
|---------|--------|------------|-----------|
| Audio Recording | ✅ Real | MediaRecorder API | Real |
| Real-time Transcription | ✅ Real | Web Speech API | Real (browser) |
| Server Transcription | ✅ Real | Whisper API | Real |
| Content Analysis | ✅ Real | GPT-Audio-Mini | Real |
| Keyword Extraction | ✅ Real | GPT-Audio-Mini | Real |
| Sentiment Analysis | ✅ Real | GPT-Audio-Mini | Real |
| Engagement Analysis | ✅ Real | GPT-Audio-Mini | Real |
| Objection Detection | ✅ Real | GPT-Audio-Mini | Real |
| Competitor Analysis | ✅ Real | GPT-Audio-Mini | Real |
| Sentiment by Person | ✅ Real | GPT-Audio-Mini | Real |
| Voice Tone Analysis | ✅ Real | Web Audio API + Logic | Real |
| Call Comparison | ✅ Real | Data Processing | Real |
| Training Mode | ✅ Real | UI Component | Real |
| Dark Mode | ✅ Real | CSS + localStorage | Real |
| Advanced Search | ✅ Real | Filter Logic | Real |
| Collaboration | ✅ Real | Database | Real |
| Notifications | ✅ Real | React Context | Real |
| Database Storage | ✅ Real | PostgreSQL | Real |
| Caching | ✅ Real | Redis | Real |
| Background Processing | ✅ Real | BullMQ | Real |
| Rate Limiting | ✅ Real | Express Rate Limit | Real |
| Authentication | ✅ Real | NextAuth.js | Real |

---

## ⚠️ Limitations & Requirements

### Browser Compatibility

- **Web Speech API**: Chrome, Edge only (real-time transcription)
- **MediaRecorder**: All modern browsers
- **Web Audio API**: All modern browsers

### Infrastructure Requirements

- **PostgreSQL**: Required for full functionality (can use localStorage fallback)
- **Redis**: Required for caching and queues (optional but recommended)
- **OpenAI API Key**: Required for transcription and analysis

### Storage Limits

- **localStorage**: ~5MB limit (automatic cleanup of old recordings)
- **PostgreSQL**: Unlimited (recommended for production)
- **Redis**: Configurable memory limit

---

## 🔒 Security Features

- ✅ API key stored server-side only
- ✅ Password hashing with bcrypt
- ✅ JWT session tokens
- ✅ Rate limiting on all APIs
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ HTTPS recommended for production

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio (database GUI)
```

---

## 🤝 Contributing

This is a demonstration project. For improvements:

1. Fork the project
2. Create a branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 🔐 Security & Rate Limiting

### Rate Limiting
- **Transcription API**: 20 requests/hour per IP
- **Analysis API**: 50 requests/hour per IP
- **Real-time Analysis**: 100 requests/hour per IP
- **Objection Analysis**: 30 requests/hour per IP
- **Sentiment by Person**: 30 requests/hour per IP
- **Implementation**: Express Rate Limit middleware
- **Storage**: Redis (optional, falls back to memory)

### Security Features
- ✅ API keys stored server-side only (`.env.local`)
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT session tokens (30 days expiry)
- ✅ Rate limiting on all API endpoints
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ HTTPS recommended for production
- ✅ File size limits (25MB max for audio)
- ✅ File cleanup on errors

### Caching Strategy
- **Transcription Cache**: 7 days TTL (Redis)
- **Analysis Cache**: 30 days TTL (Redis)
- **Cache Key**: Hash of audio content or transcription text
- **Cache Invalidation**: Manual or TTL expiration
- **Fallback**: Direct API call if cache miss

### Background Processing
- **Queue System**: BullMQ with Redis
- **Retry Logic**: 3 attempts with exponential backoff
- **Job Status**: pending, processing, completed, failed
- **Progress Updates**: WebSocket (future implementation)
- **Error Handling**: Detailed error logging and user notifications

---

## 📄 License

This project is proprietary and developed for demonstration purposes. All rights reserved.

---

## 📧 Contact

For technical support or questions about CallInsight AI, please open an issue in the repository.

---

<div align="center">

**Developed with ❤️ using Next.js, React, OpenAI, PostgreSQL, and Redis**

</div>

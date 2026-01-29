# 🧠 HackMentor AI

> Your AI pair programmer that watches your screen and coaches you in real-time

Built for **SNOW FEST 2026** 🏆

## 🎯 What is HackMentor?

HackMentor AI is an intelligent coding assistant that:
- 👁️ **Watches your screen** in real-time using Vision AI
- 🎤 **Speaks feedback** like a senior developer sitting next to you
- 🔍 **Detects issues** instantly (bugs, security, performance)
- 📚 **Teaches concepts** as you code
- 🏥 **Monitors health** to prevent burnout

## ✨ Features

### Core Features
- **Real-time Screen Analysis** - AI analyzes your code (OpenAI fallback available)
- **Smart Chat with Code Detection** - Paste code in chat for instant review
- **Voice Coaching** - Get spoken feedback with ElevenLabs TTS or browser voice
- **Interactive Chat** - Ask questions and get instant answers
- **Automatic Code Review** - AI detects code in messages and reviews automatically

### AI-Powered
- **Vision AI** (GPT-4o-mini fallback) - Extracts code from screenshots
- **Code Analysis** (Groq Llama 3.1) - Fast, intelligent code review
- **Smart Code Detection** - Automatically detects and reviews code in chat
- **Voice Synthesis** (ElevenLabs + Browser fallback) - Natural text-to-speech

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API keys (see below)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/hackmentor-ai.git
cd hackmentor-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Models
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
VOYAGE_API_KEY=your_voyage_key

# Voice (Optional)
ELEVENLABS_API_KEY=your_elevenlabs_key

# Cache (Optional)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

4. **Set up Supabase database**

Go to your Supabase project → SQL Editor → Run the schema from `supabase/schema.sql`

5. **Run development server**
```bash
npm run dev
```

6. **Open browser**
```
http://localhost:3000
```

## 🔑 Getting API Keys

### Required Keys

**1. Supabase** (Database + Auth + Storage)
- Go to https://supabase.com
- Create new project
- Get URL and keys from Settings → API

**2. Groq** (Code Analysis - FREE!)
- Go to https://console.groq.com
- Sign up and create API key
- Free tier: 14,400 requests/day

**3. OpenAI** (Vision AI)
- Go to https://platform.openai.com
- Create API key
- $5 free credits for new accounts

**4. Voyage AI** (Embeddings - FREE!)
- Go to https://www.voyageai.com
- Sign up and get API key
- Free tier: 100M tokens/month

### Optional Keys

**5. ElevenLabs** (Voice - Optional)
- Go to https://elevenlabs.io
- Get API key from Profile
- Free: 10K characters/month
- Fallback: Browser's Web Speech API

**6. Upstash Redis** (Caching - Optional)
- Go to https://upstash.com
- Create Redis database
- Free: 10K commands/day

## 📁 Project Structure

```
hackmentor-ai/
├── app/
│   ├── api/
│   │   ├── analyze-screen/    # Screen analysis endpoint
│   │   ├── chat/              # Chat endpoint
│   │   └── test-setup/        # Setup verification
│   ├── dashboard/             # Main dashboard
│   ├── setup-check/           # Setup status page
│   └── page.tsx               # Landing page
├── components/
│   ├── screen-capture.tsx     # Screen sharing component
│   ├── ai-chat.tsx            # Chat interface
│   └── ui/                    # Shadcn UI components
├── lib/
│   ├── openai.ts              # OpenAI Vision integration
│   ├── groq.ts                # Groq code analysis
│   ├── elevenlabs.ts          # Voice synthesis
│   ├── supabase.ts            # Database client
│   └── redis.ts               # Cache client
└── supabase/
    └── schema.sql             # Database schema
```

## 🎮 How to Use

### Method 1: Screen Sharing (if OpenAI available)
1. Go to Dashboard
2. Click "Start Mentoring Session"
3. Share your code editor window
4. Get real-time feedback

### Method 2: Chat-based Review (Always works!)
1. Go to Dashboard
2. In the chat, type: "Review this code:"
3. Paste your code (with or without ``` code blocks)
4. Get instant analysis!

**Example:**
```
Review this code:
function hello() {
  console.log('hi')
}
```

### Ask Questions
- "How do I fix this error?"
- "Explain async/await"
- "What's wrong with my code?"
- "Best practices for React hooks?"

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI**: Shadcn UI, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL + pgvector)
- **Cache**: Upstash Redis
- **AI Models**:
  - GPT-4o-mini (Vision)
  - Groq Llama 3.1 (Code Analysis)
  - Voyage AI (Embeddings)
  - ElevenLabs (Voice)
- **Deployment**: Vercel

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Screen capture & analysis
- ✅ Real-time code review
- ✅ AI chat interface
- ✅ Voice feedback
- ✅ Basic health monitoring

### Phase 2 (Next)
- [ ] RAG system with knowledge base
- [ ] Multi-user collaboration
- [ ] GitHub integration
- [ ] VS Code extension
- [ ] Advanced health features

### Phase 3 (Future)
- [ ] Mobile app
- [ ] Team analytics
- [ ] Custom AI training
- [ ] Enterprise features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning and building!

## 👨‍💻 Author

**Yashodip More**
- GitHub: [@yashodipmore](https://github.com/yashodipmore)
- Built for SNOW FEST 2026

## 🙏 Acknowledgments

- OpenAI for GPT-4 Vision
- Groq for lightning-fast inference
- Supabase for amazing backend
- ElevenLabs for natural voice
- All open-source contributors

---

**Made with ❤️ for developers who want to code better**

🏆 **SNOW FEST 2026 Submission**

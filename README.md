# Lumio AI Chat Application

A modern, full-stack AI chat application built with Next.js and Supabase, featuring both text and image generation capabilities powered by Google's Gemini AI.

## Features

- **AI-Powered Chat**: Intelligent conversations using Gemini 2.5 Flash
- **Image Generation**: Create images from text prompts with Gemini 2.5 Flash Image
- **Image Studio**: Advanced image editing and generation interface
- **User Authentication**: Secure auth with Supabase
- **Real-time Updates**: Live message and usage tracking
- **Responsive Design**: Beautiful UI that works on all devices
- **Usage Tracking**: Monitor API usage and limits
- **File Upload**: Support for image uploads and processing

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (Database, Auth, Real-time)
- **AI**: Google Gemini 2.5 Flash (Text & Image)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/zentriq68-boop/lumio-chat-nextjs.git
cd lumio-chat-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `GOOGLE_AI_API_KEY` | Your Google AI API key for Gemini |

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components
│   ├── chat-interface.tsx # Main chat interface
│   └── image-studio.tsx  # Image generation studio
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── public/               # Static assets
└── supabase/             # Supabase configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Google AI](https://ai.google.dev/) for the Gemini AI models
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Radix UI](https://www.radix-ui.com/) for the component primitives
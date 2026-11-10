# My First AI Chatbot

A simple AI chatbot for beginners. You type a message, the app sends it to a
small Node.js server, the server asks the Groq AI, and the answer appears in
the chat.

## What the project does

- Shows a clean chat interface in the browser
- Sends your messages to an AI model through the Groq API
- Remembers the conversation while the page stays open
- Keeps your secret API key safe on the server

## Technologies used

- HTML, CSS, vanilla JavaScript (frontend)
- Node.js (backend, as a Vercel serverless function)
- Groq API (AI responses)
- Vercel (hosting) and Vercel CLI (local development)
- Git and GitHub (version control)

## Prerequisites

1. **Node.js 18 or newer**: download from https://nodejs.org (check with `node -v`)
2. **Git**: download from https://git-scm.com (check with `git --version`)
3. **A free Groq account and API key**: https://console.groq.com/keys
4. **A free GitHub account**: https://github.com
5. **A free Vercel account**: https://vercel.com

## Installation

```bash
cd my-first-chatbot
npm install
```

## Configure the Groq API key

1. Copy `.env.example` to a new file named `.env.local`
   (or edit the `.env.local` that already exists).
2. Open `.env.local` and replace the placeholder:

```
GROQ_API_KEY=paste_your_real_key_here
```

3. Save the file. Never share this key or upload it to GitHub.

## Run locally

```bash
npm run dev
```

The first time, Vercel will ask you to log in and set up the project. Answer
the questions (the defaults are fine), then open the address it prints,
usually http://localhost:3000.

## Deploy to Vercel

1. Push your code to GitHub (see the steps in the course notes).
2. Run `npx vercel` and follow the prompts to create the project.
3. Add your key: `npx vercel env add GROQ_API_KEY` (choose all environments).
4. Deploy to production: `npx vercel --prod`.

Alternatively, import the GitHub repository at https://vercel.com/new and add
`GROQ_API_KEY` under Settings → Environment Variables.

## Troubleshooting

- **"Server is missing GROQ_API_KEY"**: check your `.env.local` file, then restart `npm run dev`.
- **Model error**: Groq may have retired the model. Pick a current one at https://console.groq.com/docs/models and update `MODEL` in `api/chat.js`.
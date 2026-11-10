# Project Notes

## How the app works (the big picture)

```
Browser (index.html + CSS + JS)
        |  sends your messages
        v
/api/chat  (api/chat.js, runs on the server)
        |  adds the secret API key
        v
Groq API  (the AI)
        |  returns an answer
        v
Back to the browser, which shows it in the chat
```

The browser never talks to Groq directly. If it did, anyone could open the
browser tools and steal your API key. The server in the middle keeps the key
secret.

## Files and folders

| Path | Purpose |
| --- | --- |
| `index.html` | The page structure: heading, message area, input, button. |
| `src/css/style.css` | Colors, layout, and the mobile-friendly design. |
| `src/js/script.js` | Frontend logic: sending messages, showing replies, loading and errors. |
| `api/chat.js` | The backend. Checks requests, calls Groq, returns the reply. |
| `package.json` | Project info, the `npm run dev` command, and the Vercel CLI dependency. |
| `.env.local` | Your real secret key, used on your computer only. Never uploaded. |
| `.env.example` | A safe template showing which variables are needed. |
| `.gitignore` | Tells Git which files to never upload (secrets, node_modules). |
| `README.md` | Setup and deployment instructions. |
| `docs/project-notes.md` | This file. |

## Key ideas for students

- **Frontend**: what the user sees and clicks (HTML, CSS, JavaScript in the browser).
- **Backend**: code that runs on a server, where secrets are safe.
- **API**: a way for programs to talk to each other. Our frontend calls `/api/chat`, and our backend calls Groq.
- **Environment variable**: a secret setting stored outside your code (`GROQ_API_KEY`).
- **Conversation history**: the `conversation` array in `script.js`. It is sent with every request so the AI remembers earlier messages. It resets when you refresh the page.

## Ideas to extend the project

- Change the personality in `SYSTEM_PROMPT` inside `api/chat.js`
- Add a "Clear chat" button
- Change the colors in `style.css`
// api/chat.js
// Vercel serverless function. The browser calls it at /api/chat.
// It runs on the server, so your secret API key is never sent to the browser.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

const MAX_MESSAGES = 20; // keep only the most recent messages
const MAX_MESSAGE_LENGTH = 4000; // max characters per message
const ALLOWED_ROLES = ["user", "assistant"];

const SYSTEM_PROMPT =
  "You are a friendly, helpful AI assistant for beginner programming students. " +
  "Give clear, simple answers and keep them reasonably short.";

export default async function handler(req, res) {
  // 1. Accept POST requests only
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // 2. Read the secret API key from environment variables
  console.log("GROQ KEY STATUS:", Boolean(process.env.GROQ_API_KEY));
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Server is missing GROQ_API_KEY. Check your environment variables.",
    });
  }

  // 3. Read the request body (Vercel usually parses JSON for us)
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Request body is not valid JSON." });
    }
  }

  // 4. Validate the incoming messages
  const messages = body && body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ error: "'messages' must be a non-empty array." });
  }

  for (const msg of messages) {
    if (
      !msg ||
      !ALLOWED_ROLES.includes(msg.role) ||
      typeof msg.content !== "string" ||
      msg.content.trim() === ""
    ) {
      return res.status(400).json({
        error:
          "Each message needs a role ('user' or 'assistant') and non-empty text content.",
      });
    }
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `A message is too long (max ${MAX_MESSAGE_LENGTH} characters).`,
      });
    }
  }

  // Keep only role + content, and only the latest messages
  const cleanMessages = messages
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content }));

  // 5. Call the Groq Chat Completions API
  try {
    const groqResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...cleanMessages],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await groqResponse.json().catch(() => null);

    if (!groqResponse.ok) {
      const message =
        (data && data.error && data.error.message) || "Groq API request failed.";
      console.error("Groq API error:", groqResponse.status, message);
      return res.status(groqResponse.status).json({ error: message });
    }

    const reply =
      data && data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : null;

    if (!reply) {
      return res.status(502).json({ error: "Groq returned an empty response." });
    }

    // 6. Send the AI reply back to the browser
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ error: "Could not reach the AI service. Try again." });
  }
}
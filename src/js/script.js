// src/js/script.js
// Frontend logic: sends messages to /api/chat and shows the replies.

const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");

// Conversation history for the current session (lost when the page reloads).
// Each item looks like: { role: "user" | "assistant", content: "text" }
const conversation = [];

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text; // textContent is safe: it never runs HTML
  chatMessages.appendChild(div);
  scrollToBottom();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

function clearError() {
  errorEl.textContent = "";
  errorEl.classList.add("hidden");
}

function setLoading(isLoading) {
  loadingEl.classList.toggle("hidden", !isLoading);
  sendButton.disabled = isLoading;
  userInput.disabled = isLoading;
  if (!isLoading) userInput.focus();
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (text === "") return;

  clearError();
  addMessage(text, "user");
  conversation.push({ role: "user", content: text });
  userInput.value = "";
  setLoading(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }

    addMessage(data.reply, "ai");
    conversation.push({ role: "assistant", content: data.reply });
  } catch (error) {
    // Remove the failed user message so history stays consistent
    conversation.pop();
    showError(error.message || "Network error. Please try again.");
  } finally {
    setLoading(false);
  }
}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});
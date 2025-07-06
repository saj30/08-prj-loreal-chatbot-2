// System prompt for the chatbot
const systemPrompt = `You are a helpful assistant for L’Oréal. Only answer questions related to L’Oréal products, skincare, haircare, beauty routines, and product recommendations. If a question is not about L’Oréal or its products, politely explain that you can only help with L’Oréal-related topics.`;

// DOM elements
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Store conversation messages
let messages = [{ role: "system", content: systemPrompt }];

// Add message to chat window
function addMessageToChat(role, content) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", role);
  messageDiv.textContent = content;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Send message to Cloudflare Worker
async function getChatbotResponse() {
  const workerUrl = "https://loreal-chatbot.sajjadmajeed85.workers.dev/"; 

  addMessageToChat("assistant", "Thinking...");

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages, // Only send messages — no model field
      }),
    });

    const data = await response.json();

    // Remove loading message
    const loadingMsg = chatWindow.querySelector(".assistant:last-child");
    if (loadingMsg && loadingMsg.textContent === "Thinking...") {
      chatWindow.removeChild(loadingMsg);
    }

    const reply =
      data.choices && data.choices[0].message.content
        ? data.choices[0].message.content.trim()
        : "Sorry, I couldn't get a response. Please try again.";

    addMessageToChat("assistant", reply);
    messages.push({ role: "assistant", content: reply });
  } catch (error) {
    const loadingMsg = chatWindow.querySelector(".assistant:last-child");
    if (loadingMsg && loadingMsg.textContent === "Thinking...") {
      chatWindow.removeChild(loadingMsg);
    }
    addMessageToChat(
      "assistant",
      "Sorry, there was a problem connecting to the chatbot."
    );
  }
}

// Form submit listener
chatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessageToChat("user", userMessage);
  messages.push({ role: "user", content: userMessage });
  userInput.value = "";

  getChatbotResponse();
});

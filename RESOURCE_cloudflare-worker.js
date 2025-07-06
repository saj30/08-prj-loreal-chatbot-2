// Cloudflare Worker: Secure OpenAI Proxy for L'Oréal Chatbot

export default {
  async fetch(request, env, ctx) {
    // Only allow POST requests
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Read the incoming request body (should be JSON)
    const body = await request.text();

    // Forward the request to OpenAI's API
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Use the secret stored in Cloudflare dashboard
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: body,
      }
    );

    // Return OpenAI's response directly to the frontend
    return new Response(openaiResponse.body, openaiResponse);
  },
};

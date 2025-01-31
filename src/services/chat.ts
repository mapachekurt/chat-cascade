const WEBHOOK_URL = "https://webhook-processor-production-a94c.up.railway.app/webhook/53c136fe-3e77-4709-a143-fe82746dd8b6/chat";

export const sendMessage = async (message: string) => {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};
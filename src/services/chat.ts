
const WEBHOOK_URL = "https://webhook-processor-production-a94c.up.railway.app/webhook/53c136fe-3e77-4709-a143-fe82746dd8b6/chat";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export const sendMessage = async (message: string) => {
  console.log('Sending message to webhook:', message);
  
  const response = await fetch(CORS_PROXY + WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": window.location.origin,
    },
    body: JSON.stringify({
      sessionId: crypto.randomUUID().replace(/-/g, ''),
      action: "sendMessage",
      chatInput: message
    }),
  });

  if (!response.ok) {
    console.error('Webhook response not OK:', response.status, response.statusText);
    const errorData = await response.text();
    console.error('Error response:', errorData);
    if (response.status === 403 && errorData.includes('/corsdemo')) {
      throw new Error('Please enable CORS proxy by visiting https://cors-anywhere.herokuapp.com/corsdemo first');
    }
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Received response from webhook:', data);
  return data;
};

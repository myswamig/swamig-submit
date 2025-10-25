export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "https://swamiginstitute.com",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === "POST") {
      const data = await request.json();

      const emailBody = `
      New SwamiG Institute Application:
      ------------------------------
      Legal Name: ${data.legal_name}
      Preferred Name: ${data.preferred_name}
      Email: ${data.email}
      Phone: ${data.phone}
      `;

      await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: "app@swamiginstitute.com" }] }],
          from: { email: "no-reply@swamiginstitute.com", name: "SwamiG Institute" },
          subject: "New Application Received",
          content: [{ type: "text/plain", value: emailBody }],
        }),
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          "Access-Control-Allow-Origin": "https://swamiginstitute.com",
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  },
};

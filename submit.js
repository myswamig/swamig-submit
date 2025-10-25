export default {
  async fetch(request) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://swamig-application.pages.dev",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Handle actual form POST
    if (request.method === "POST") {
      try {
        const data = await request.json();

        const emailBody = `
New SwamiG Institute Application
-------------------------------
Legal Name: ${data.legal_name}
Preferred Name: ${data.preferred_name}
Email: ${data.email}
Phone: ${data.phone}
`;

        // Send email using MailChannels
        const send = await fetch("https://api.mailchannels.net/tx/v1/send", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            personalizations: [
              { to: [{ email: "app@swamiginstitute.com", name: "SwamiG Applications" }] },
            ],
            from: { email: "no-reply@swamiginstitute.com", name: "SwamiG Institute" },
            subject: "New Application Submission",
            content: [{ type: "text/plain", value: emailBody }],
          }),
        });

        if (!send.ok) {
          console.error("MailChannels error:", await send.text());
          return new Response(JSON.stringify({ success: false, error: "Email failed" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Error parsing JSON:", err);
        return new Response(JSON.stringify({ success: false, error: "Bad request" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Reject all other methods
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  },
};

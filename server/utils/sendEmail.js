const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
  const result = await resend.emails.send({
    from: "Expenz <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  console.log("Resend result:", JSON.stringify(result, null, 2));

  if (result.error) {
    throw new Error(result.error.message);
  }
}

module.exports = sendEmail;

// Deploy-ready configuration for Azure App Service (Node 20+)
// All sensitive values are read from environment variables.

module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",

  // JWT
  secretKey: process.env.JWT_PRIVATE_KEY || "",
  expiredAfter: process.env.TOKEN_EXPIRES_MS
    ? parseInt(process.env.TOKEN_EXPIRES_MS)
    : 3600000,

  // AWS (only if used)
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",

  // Mail settings
  mailSettings: {
    mailId: process.env.MAIL_ID || "",
    mailPwd: process.env.MAIL_PWD || "",
    mailHost: process.env.MAIL_HOST || "",
    mailPort: process.env.MAIL_PORT
      ? parseInt(process.env.MAIL_PORT)
      : 587,
    secure: process.env.MAIL_SECURE === "true"
  },

  // Azure Communication Services Email
  acsEmail: {
    useMsi: process.env.ACS_EMAIL_USE_MANAGED_IDENTITY === "true",
    primaryConnectionString: process.env.ACS_EMAIL_PRIMARY_CONNECTION_STRING || "",
    secondaryConnectionString: process.env.ACS_EMAIL_SECONDARY_CONNECTION_STRING || "",
    senderAddress: process.env.ACS_EMAIL_SENDER_ADDRESS || "",
    disableEngagementTracking:
      process.env.ACS_EMAIL_DISABLE_ENGAGEMENT_TRACKING === "true"
  },

  // Port (Azure provides PORT automatically)
  port: process.env.PORT || 3000
};

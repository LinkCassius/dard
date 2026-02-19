
// Deploy-ready MongoDB configuration for Azure App Service (Node 20+)

module.exports = {
  database: process.env.MONGODB_URI || ""
};

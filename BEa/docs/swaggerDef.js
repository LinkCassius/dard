module.exports = {
  info: {
    // API informations (required)
    title: "TDAP API Doc", // Title (required)
    version: "1.0.0", // Version (required)
    description: "API's For TDAP", // Description (optional)
  },
  //host:'localhost:9000', // Host (optional)
  basePath: "/", // Base path (optional)
  apis: ["./routes/*.js", "./models/*.js"], // <-- We add this property:
};

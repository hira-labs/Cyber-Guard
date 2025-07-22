// swagger.js

const swaggerJSDoc = require("swagger-jsdoc");
require('dotenv').config();
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Next.js API Documentation",
    version: "1.0.0",
    description:
      "This is a simple API to demonstrate Swagger integration in Next.js",
  },
  servers: [
    {
      url: "http://localhost:3000", // Make sure this URL is correct for your setup
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/pages/api/**/*.js"], // Updated path
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

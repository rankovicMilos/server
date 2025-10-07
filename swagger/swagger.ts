import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Dental Email Sender API",
    version: "1.0.0",
    description: "API for sending dental medical form data via email",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./server.ts", "./routes/*.ts", "./routes/emailRoutes.ts"], // Path to the API routes in your TypeScript application
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;

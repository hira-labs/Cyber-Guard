// pages/swagger.js
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerPage() {
    console.log("OpenAI API Key:", process.env.HUGGINGFACE_API_TOKEN);
  return (
    <div>
      <h1>API Documentation</h1>
      <SwaggerUI url="/api/docs" /> {/* Corrected URL to the docs endpoint */}
    </div>
  );
}

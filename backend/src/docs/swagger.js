// backend/src/docs/swagger.js
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

function loadOpenApiSpec() {
  const p = path.join(__dirname, "openapi.yaml");
  const raw = fs.readFileSync(p, "utf8");
  return yaml.load(raw);
}

function mountSwagger(app) {
  const spec = loadOpenApiSpec();

  // Serve JSON spec
  app.get("/api/openapi.json", (req, res) => {
    res.json(spec);
  });

  // Serve Swagger UI
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec));
}

module.exports = { mountSwagger, loadOpenApiSpec };

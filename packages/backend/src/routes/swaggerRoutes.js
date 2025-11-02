import express from "express";
import swaggerUiExpress from "swagger-ui-express";
import { readFile } from "node:fs/promises";
import yaml from "js-yaml";

const swaggerDocument = yaml.load(
    await readFile(new URL("../docs/openapi-spec.yaml", import.meta.url), "utf8")
);

export function swaggerRoutes() {
    const router = express.Router();
    router.use('/api-docs', swaggerUiExpress.serve);
    router.get('/api-docs', swaggerUiExpress.setup(swaggerDocument));
    return router;
}   
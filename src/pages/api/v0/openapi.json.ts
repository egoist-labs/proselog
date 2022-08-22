import { NextApiHandler } from "next"
import { generateOpenApiDocument } from "trpc-openapi"
import { appRouter } from "~/router"

// Generate OpenAPI schema document
const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Proselog API",
  description: "Public API for Proselog",
  version: "0.0.0",
  baseUrl: "http://localhost:3000/api/v0",
})

const handler: NextApiHandler = (req, res) => {
  res.send(openApiDocument)
}

export default handler

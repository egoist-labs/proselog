import { NextApiRequest, NextApiResponse } from "next";
import cors from 'nextjs-cors';
import { createOpenApiNextHandler } from "trpc-openapi"
import { getTRPCContext } from "~/lib/trpc.server"
import { appRouter } from "~/router"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Setup CORS
  await cors(req, res);
  
  // Handle incoming OpenAPI requests
  return createOpenApiNextHandler({
    router: appRouter,
    createContext: getTRPCContext,
  })(req, res);
};

export default handler;

import { Elysia } from "elysia";
import NotionController from "./controllers/NotionController";
import UnauthorizedMiddleware from "./middlewares/UnauthorizedMiddleware";

const app = new Elysia()
  .get("/health", ({ request, status }) => {
    console.log("Health check");
    const isUnauthorized = new UnauthorizedMiddleware().handle(request);
    if (isUnauthorized) return status(401, "Unauthorized");

    return "Healthy";
  })
  .get("/", async ({ request, status }) => {
    const isUnauthorized = new UnauthorizedMiddleware().handle(request);
    if (isUnauthorized) return status(401, "Unauthorized");

    return await NotionController.index();
  })
  .post("/scores", async ({ body, request, status }) => {
    const isUnauthorized = new UnauthorizedMiddleware().handle(request);
    if (isUnauthorized) return status(401, "Unauthorized");

    const { pseudo, score } = body as { pseudo: string; score: number };
    return await NotionController.create(pseudo, score);
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

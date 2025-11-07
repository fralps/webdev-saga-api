import { Elysia } from "elysia";
import NotionController from "./controllers/NotionController";

const app = new Elysia()
  .get("/", async () => {
    return await NotionController.index();
  })
  .post("/scores", async ({ body }) => {
    const { pseudo, score } = body as { pseudo: string; score: number };
    return await NotionController.create(pseudo, score);
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

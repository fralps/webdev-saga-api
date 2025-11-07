import type { status } from "elysia";

class UnauthorizedMiddleware {
  private readonly authToken: string;

  constructor() {
    this.authToken = process.env.AUTH_TOKEN || "";
  }

  handle(request: Request): boolean {
    const authHeader = request.headers.get("Authorization");

    if (authHeader !== `Bearer ${this.authToken}`) {
      return true;
    }

    return false;
  }
}

export default UnauthorizedMiddleware;
import type { createApiClient } from "@/api/client";
import type { Role } from "./auth.type";

export default class AuthUseCase {
  constructor(private readonly client: ReturnType<typeof createApiClient>) {}

  async login(vars: { username: string; password: string }): Promise<string> {
    const response = await this.client.POST("/api/auth/login", {
      body: vars,
      parseAs: "text",
    });

    if (!response.response?.ok) {
      throw new Error("error/auth/login");
    }

    const token = (response.data as unknown as string) ?? "";
    if (!token) {
      throw new Error("no-data/auth/login/token");
    }

    return token;
  }

  async register(vars: {
    username: string;
    password: string;
    roles?: Role[];
  }): Promise<string> {
    const response = await this.client.POST("/api/users", {
      body: vars,
      parseAs: "text",
    });

    // Handle plain-text backend responses like:
    //  - "Username already exists"
    //  - "User created successfully"
    const text = (response as unknown as string) ?? "";
    const error = response.error as unknown as string;

    if (!response.response?.ok) {
      if (error.toLowerCase().includes("exists")) {
        throw new Error("error/auth/register/exists");
      }
      throw new Error("error/auth/register");
    }

    // No token provided by backend; return the message to the caller
    // The controller should not auto-login based on this value.
    return text;
  }
}

export default class AuthPresenter {
  getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/auth/login":
        return "Invalid username or password.";
      case "no-data/auth/login/token":
        return "Login succeeded but no token was returned.";
      case "error/auth/register/exists":
        return "Username already exists.";
      case "error/auth/register":
        return "Registration failed. Please try again.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  private extractMessage(error: unknown): string | undefined {
    if (!error) return undefined;
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    if (
      typeof error === "object" &&
      "message" in (error as Record<string, unknown>)
    ) {
      const msg = (error as Record<string, unknown>).message;
      if (typeof msg === "string") return msg;
    }
    return undefined;
  }
}

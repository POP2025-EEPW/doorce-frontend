export interface AuthClient {
  login(
    this: void,
    credentials: {
      username: string;
      password: string;
    },
  ): Promise<{ userId: string }>;
  getMe(this: void): Promise<{ userId: string; roles: string[] }>;
}

export function buildAuthUC(client: AuthClient) {
  return {
    login: (username: string, password: string) =>
      client.login({ username, password }),
    getMe: () => client.getMe(),
  };
}

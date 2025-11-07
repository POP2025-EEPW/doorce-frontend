import createClient from "openapi-fetch";
import type { paths } from "./openapi-schema";
import { useAuth } from "@/application/auth/auth-store";

interface CreateOpenApiClientProps {
  baseUrl: string;
  getToken: () => string | null;
}

export function createApiClient(props: CreateOpenApiClientProps) {
  const { baseUrl, getToken } = props;

  const client = createClient<paths>({ baseUrl: baseUrl });

  client.use({
    onRequest({ request }) {
      const headers = new Headers(request.headers);

      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);

      return new Request(request, {
        headers,
      });
    },
  });

  return client;
}

export const apiClient = createApiClient({
  baseUrl: "",
  getToken: () => {
    try {
      const state = useAuth.getState();
      return state.token ?? localStorage.getItem("token");
    } catch {
      return null;
    }
  },
});

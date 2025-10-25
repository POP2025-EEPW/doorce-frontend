// src/app/di.ts
import { useAuth } from "@/auth/auth-store";
import { Http } from "@/api/http";
import { buildDatasetUC } from "@/use-cases/dataset.uc";
import { buildQualityUC } from "@/use-cases/quality.uc";
import { buildAuthUC } from "@/use-cases/auth.uc";
import { buildRealClient } from "@/api/apiClient";
import { buildMockClient } from "@/mocks/mockClient";

const getUserId = (): string | null => useAuth.getState().userId;
const baseUrl: string =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:8080";
const useMock: boolean = import.meta.env.VITE_USE_MOCK === "true";

const http = new Http(baseUrl, getUserId);
const client = useMock ? buildMockClient() : buildRealClient(http);

export const uc = {
  dataset: buildDatasetUC(client),
  quality: buildQualityUC(client),
  auth: buildAuthUC(client),
};

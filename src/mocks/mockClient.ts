// src/mocks/mockClient.ts
import type { CombinedClient } from "@/api/types";
import catalogsJson from "@/mocks/mock_data/catalogs.json";
import datasetsJson from "@/mocks/mock_data/datasets.json";
import type {
  Catalog,
  CatalogSummary,
  CreateCatalogInput,
  CreateDatasetInput,
  Dataset,
  DatasetSummary,
} from "@/domain/types/dataset";
import type {
  CreateDataRelatedRequestInput,
  CreateDatasetCommentInput,
  DataRelatedRequest,
  DatasetComment,
} from "@/domain/types/quality";
import usersJson from "@/mocks/mock_data/users.json";

const catalogs = catalogsJson as CatalogSummary[];
const datasets = datasetsJson as Dataset[];

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

export function buildMockClient(): CombinedClient {
  return {
    // Dataset
    async listCatalogs(parentId?: string | null) {
      await delay();
      if (parentId === undefined) return catalogs;
      return catalogs.filter((c) => c.parentCatalogId === (parentId ?? null));
    },
    async getCatalog(id: string) {
      await delay();
      const summary = catalogs.find((c) => c.id === id);
      if (!summary) throw new Error("Not found");
      const children = catalogs.filter((c) => c.parentCatalogId === id);
      const catalog: Catalog = { ...summary, children };
      return catalog;
    },
    async addCatalog(_input: CreateCatalogInput) {
      console.log("addCatalog", _input);
      await delay();
      return { id: "mock-" + crypto.randomUUID() };
    },
    async listCatalogDatasets(catalogId: string) {
      await delay();
      return datasets
        .filter((d) => d.catalogId === catalogId)
        .map<DatasetSummary>((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          status: d.status,
          catalogId: d.catalogId,
        }));
    },
    async addDataset(_input: CreateDatasetInput) {
      console.log("addDataset", _input);
      await delay();
      return { id: "mock-" + crypto.randomUUID() };
    },
    async getDataset(id: string) {
      await delay();
      const found = datasets.find((d) => d.id === id);
      if (!found) throw new Error("Not found");
      return found;
    },

    // Quality
    async addDatasetComment(
      _datasetId: string,
      _input: CreateDatasetCommentInput
    ) {
      await delay();
      console.log("addDatasetComment", _datasetId, _input);
      return { id: crypto.randomUUID() };
    },
    async listDatasetComments(_datasetId: string) {
      await delay();
      console.log("listDatasetComments", _datasetId);
      const empty: DatasetComment[] = [];
      return empty;
    },
    async submitDataRelatedRequest(_req: CreateDataRelatedRequestInput) {
      await delay();
      console.log("submitDataRelatedRequest", _req);
      return { id: crypto.randomUUID() };
    },
    async listDataRelatedRequests() {
      await delay();
      const empty: DataRelatedRequest[] = [];
      return empty;
    },

    // Auth
    async login(credentials: { username: string; password: string }) {
      await delay();
      const users = usersJson as {
        username: string;
        password: string;
        userId: string;
        roles: string[];
      }[];
      const found = users.find(
        (u) =>
          u.username === credentials.username &&
          u.password === credentials.password
      );
      if (!found) throw new Error("Invalid credentials");
      console.log("login", credentials);
      return { userId: found.userId };
    },
    async getMe() {
      await delay();
      // In a real app we'd read from auth-store or token; for Storybook/dev we default
      return { userId: "student-1", roles: ["MetadataManager"] };
    },
  };
}

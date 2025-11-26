import type { DataSchema } from "./schema.type";
import mockSchemas from "@/mocks/schemas.json";

export default class DataSchemaUseCase {
  // Temporary mock data - remove when backend is ready
  private mockSchemas: DataSchema[] = mockSchemas;

  // TODO: Uncomment when backend is ready
  // constructor(private client: ReturnType<typeof createApiClient>) {}

  constructor() {
    // Empty constructor for now - will accept apiClient when backend is ready
  }

  async listSchemas(): Promise<DataSchema[]> {
    // TODO: Replace with real API call when backend is ready
    // const response = await this.client.GET("/api/v1/schemas");
    // if (!response.data) {
    //   throw new Error("Failed to fetch schemas");
    // }
    // return response.data;

    // Mock implementation with artificial delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.mockSchemas]);
      }, 500);
    });
  }

  async getSchema(schemaId: string): Promise<DataSchema> {
    // TODO: Replace with real API call when backend is ready
    // const response = await this.client.GET("/api/v1/schemas/{schemaId}", {
    //   params: {
    //     path: { schemaId },
    //   },
    // });
    // if (!response.data) {
    //   throw new Error("Failed to fetch schema");
    // }
    // return response.data;

    // Mock implementation with artificial delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const schema = this.mockSchemas.find((s) => s.id === schemaId);
        if (schema) {
          resolve({ ...schema });
        } else {
          reject(new Error(`Schema with id ${schemaId} not found`));
        }
      }, 300);
    });
  }

  async createSchema(schema: Omit<DataSchema, "id">): Promise<DataSchema> {
    // TODO: Replace with real API call when backend is ready
    // const response = await this.client.POST("/api/v1/schemas", {
    //   body: schema,
    // });
    // if (!response.data) {
    //   throw new Error("Failed to create schema");
    // }
    // return response.data;

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSchema: DataSchema = {
          id: `schema-${Date.now()}`,
          ...schema,
        };
        this.mockSchemas.push(newSchema);
        resolve(newSchema);
      }, 500);
    });
  }

  async updateSchema(
    schemaId: string,
    schema: Partial<Omit<DataSchema, "id">>,
  ): Promise<DataSchema> {
    // TODO: Replace with real API call when backend is ready
    // const response = await this.client.PATCH("/api/v1/schemas/{schemaId}", {
    //   params: {
    //     path: { schemaId },
    //   },
    //   body: schema,
    // });
    // if (!response.data) {
    //   throw new Error("Failed to update schema");
    // }
    // return response.data;

    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.mockSchemas.findIndex((s) => s.id === schemaId);
        if (index !== -1) {
          this.mockSchemas[index] = {
            ...this.mockSchemas[index],
            ...schema,
          };
          resolve({ ...this.mockSchemas[index] });
        } else {
          reject(new Error(`Schema with id ${schemaId} not found`));
        }
      }, 500);
    });
  }

  async deleteSchema(schemaId: string): Promise<void> {
    // TODO: Replace with real API call when backend is ready
    // const response = await this.client.DELETE("/api/v1/schemas/{schemaId}", {
    //   params: {
    //     path: { schemaId },
    //   },
    // });
    // if (!response.response.ok) {
    //   throw new Error("Failed to delete schema");
    // }

    // Mock implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.mockSchemas.findIndex((s) => s.id === schemaId);
        if (index !== -1) {
          this.mockSchemas.splice(index, 1);
          resolve();
        } else {
          reject(new Error(`Schema with id ${schemaId} not found`));
        }
      }, 500);
    });
  }
}

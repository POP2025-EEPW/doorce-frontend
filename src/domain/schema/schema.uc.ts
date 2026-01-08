import { createApiClient } from "@/api/client";
import type {
  CreateDataSchemaDto,
  DataSchema,
  SchemaDataType,
  SchemaOutputPort,
} from "./schema.type";

export default class SchemaUseCase {
  constructor(
    private readonly client: ReturnType<typeof createApiClient>,
    private readonly outputPort?: SchemaOutputPort,
  ) {}

  async listSchemas(): Promise<DataSchema[]> {
    try {
      const response = await this.client.GET("/api/schemas");

      if (response.error) {
        throw new Error("error/get/schema/list");
      }

      if (!response.data) {
        throw new Error("error/get/schema/list");
      }
      const rawData = response.data;
      const sourceData = Array.isArray(rawData) ? rawData : [];

      const schemas: DataSchema[] = [];
      for (const schema of sourceData) {
        schemas.push({
          ...schema,
          name: schema.title,
          version: "1.0.0",
          concepts: Array.isArray(schema.concepts)
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              schema.concepts.map((concept: Record<string, unknown>) => ({
                id: concept.id as string,
                name: concept.name as string,
                properties: Array.isArray(concept.properties)
                  ? concept.properties.map((prop) => ({
                      id: prop.id as string,
                      name: prop.name as string,
                      type: prop.type as SchemaDataType,
                      typeId: (prop.type as SchemaDataType)?.id,
                      isMandatory: prop.isMandatory as boolean,
                      unit: prop.unit as string | undefined,
                    }))
                  : [],
              }))
            : [],
        });
      }

      this.outputPort?.presentSchemas(schemas);

      return schemas;
    } catch (error) {
      this.outputPort?.presentListSchemasError(error);
      throw error;
    }
  }

  async listDataTypes(): Promise<SchemaDataType[]> {
    try {
      const response = await this.client.GET("/api/types");

      if (response.error) {
        throw new Error("error/get/schema-data-type/list");
      }

      if (!response.data) {
        throw new Error("error/get/schema-data-type/list");
      }

      const dataTypes = response.data as unknown as SchemaDataType[];

      this.outputPort?.presentDataTypes(dataTypes);

      return dataTypes;
    } catch (error) {
      this.outputPort?.presentListDataTypesError(error);
      throw error;
    }
  }

  async addSchema(dto: CreateDataSchemaDto): Promise<void> {
    try {
      if (!dto.concepts || dto.concepts.length === 0) {
        throw new Error("validation/schema/no-concepts");
      }

      const requestBody = {
        title: dto.name,
        description: dto.description ?? "",
        concepts: dto.concepts.map((concept) => {
          return {
            name: concept.name,
            properties: concept.properties.map((property) => {
              return {
                name: property.name,
                typeId: property.typeId,
              };
            }),
          };
        }),
        constraints: [],
      };

      const response = await this.client.POST("/api/schemas", {
        body: requestBody,
      });

      console.log("📥 Response:", response);

      if (response.error) {
        throw new Error("error/add/schema");
      }

      this.outputPort?.presentAddSchemaSuccess();
    } catch (error) {
      this.outputPort?.presentAddSchemaError(error);
      throw error;
    }
  }

  async editSchema(dto: CreateDataSchemaDto): Promise<void> {
    try {
      if (!dto.id) {
        throw new Error("validation/schema/no-id");
      }

      if (!dto.concepts || dto.concepts.length === 0) {
        throw new Error("validation/schema/no-concepts");
      }

      const requestBody = {
        title: dto.name,
        description: dto.description ?? "",
        concepts: dto.concepts.map((concept) => {
          return {
            id: concept.id,
            name: concept.name,
            properties: concept.properties.map((property) => {
              return {
                name: property.name,
                typeId: property.typeId,
              };
            }),
          };
        }),
        constraints: [],
      };

      const response = await this.client.PUT("/api/schemas/{schemaId}", {
        params: {
          path: { schemaId: dto.id },
        },
        body: requestBody,
      });

      if (response.error) {
        throw new Error("error/edit/schema");
      }

      this.outputPort?.presentEditSchemaSuccess();
    } catch (error) {
      this.outputPort?.presentEditSchemaError(error);
      throw error;
    }
  }
}

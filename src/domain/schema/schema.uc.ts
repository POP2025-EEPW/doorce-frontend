import { createApiClient } from "@/api/client";
import type {
  CreateDataSchemaDto,
  DataSchema, SchemaDataType,
  SchemaOutputPort
} from "./schema.type"; // Upewnij się, że nazwa pliku to .type lub .types zgodnie z Twoim projektem

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
          version: "1.0.0"
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

      const response = await this.client.POST("/api/schemas", {
        body: {
          title: dto.name,
          description: dto.description??"",
          concepts: [
              ...dto.concepts.map((concept) => ({
                name: concept.name,
                properties:[
                    ...concept.properties.map((property) => ({
                      name: property.name,
                      typeId: property.type.id
                    }))
                ]
              }))
          ],
          constraints: []
        },
      });

      // const newSchema: DataSchema = {
      //   id: `schema-${Date.now()}`,
      //   name: dto.name,
      //   description: dto.description,
      //   version: "1.0.0",
      //   concepts: dto.concepts.map((c, cIdx) => ({
      //     id: `con-${Date.now()}-${cIdx}`,
      //     name: c.name,
      //     description: c.description,
      //     properties: c.properties.map((p, pIdx) => ({
      //       id: `prop-${Date.now()}-${cIdx}-${pIdx}`,
      //       name: p.name,
      //       type: p.type,
      //       isMandatory: p.isMandatory,
      //       unit: p.unit
      //     }))
      //   }))
      // };
      // this.mockData.unshift(newSchema);

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
      if (!dto.concepts || dto.concepts.length === 0) {
        throw new Error("validation/schema/no-concepts");
      }

      const response = await this.client.PUT("/api/schemas/{schemaId}", {
        params:{
          path:{schemaId: dto.id??""}
        },
        body: {
          title: dto.name,
          description: dto.description??"",
          concepts: [
            ...dto.concepts.map((concept) => ({
              name: concept.name,
              properties:[
                ...concept.properties.map((property) => ({
                  name: property.name,
                  typeId: property.type.id
                }))
              ]
            }))
          ],
          constraints: []
        },
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
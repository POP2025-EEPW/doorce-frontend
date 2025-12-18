import { createApiClient } from "@/api/client";
import type { 
  CreateDataSchemaDto, 
  DataSchema, 
  SchemaOutputPort 
} from "./schema.type"; // Upewnij się, że nazwa pliku to .type lub .types zgodnie z Twoim projektem
import mockSchemas from "@/mocks/schemas.json";

export default class SchemaUseCase {
  private mockData: DataSchema[] = mockSchemas as unknown as DataSchema[];

  constructor(
    private readonly client: ReturnType<typeof createApiClient>,
    private readonly outputPort?: SchemaOutputPort,
  ) {}

  async listSchemas(): Promise<DataSchema[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const schemas = [...this.mockData];
      
      this.outputPort?.presentSchemas(schemas);
      
      return schemas;
    } catch (error) {
      this.outputPort?.presentListSchemasError(error);
      throw error;
    }
  }

  async addSchema(dto: CreateDataSchemaDto): Promise<void> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!dto.concepts || dto.concepts.length === 0) {
        throw new Error("validation/schema/no-concepts");
      }

      const newSchema: DataSchema = {
        id: `schema-${Date.now()}`,
        name: dto.name,
        description: dto.description,
        version: "1.0.0",
        concepts: dto.concepts.map((c, cIdx) => ({
          id: `con-${Date.now()}-${cIdx}`,
          name: c.name,
          description: c.description,
          properties: c.properties.map((p, pIdx) => ({
            id: `prop-${Date.now()}-${cIdx}-${pIdx}`,
            name: p.name,
            type: p.type,
            isMandatory: p.isMandatory,
            unit: p.unit
          }))
        }))
      };
      this.mockData.unshift(newSchema);

      this.outputPort?.presentAddSchemaSuccess();
    } catch (error) {
      this.outputPort?.presentAddSchemaError(error);
      throw error;
    }
  }
}
// domain/schema/schema.type.ts
import type { ID, ISODateString } from "../common.types";
import type { Dataset } from "../dataset/dataset.types";

// =============================================================================
// API DTO Types (match backend response)
// =============================================================================

export interface SchemaDto {
  id?: string;
  title?: string;
  description?: string;
  concepts?: ConceptDto[];
  constraints?: ConstraintDto[];
}

export interface ConceptDto {
  name?: string;
  properties?: PropertyDto[];
}

export interface PropertyDto {
  name?: string;
  typeId?: string; // UUID reference to a Type
}

export interface ConstraintDto {
  rule?: string;
}

export interface TypeDto {
  id?: string;
  name?: string;
}

// =============================================================================
// Domain Types (used by UI layer)
// =============================================================================

export interface SchemaDataType {
  id: ID;
  name: string;
}

export interface SchemaProperty {
  name: string;
  typeId?: string;
  type?: SchemaDataType;
  description?: string;
  isMandatory?: boolean;
  unit?: string;
}

export interface SchemaConcept {
  id?: ID;
  name: string;
  description?: string;
  properties: SchemaProperty[];
}

export interface SchemaConstraint {
  id?: ID;
  rule: string;
  name?: string;
  expression?: string;
  description?: string;
}

export interface DataSchema {
  id: ID;
  name: string;
  version?: string;
  description?: string;

  concepts: SchemaConcept[];
  constraints: SchemaConstraint[];

  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

// =============================================================================
// Mappers
// =============================================================================

export function mapPropertyDtoToDomain(dto: PropertyDto): SchemaProperty {
  return {
    name: dto.name ?? "",
    typeId: dto.typeId,
    // Don't set type here - it will be resolved later with actual data types
  };
}

export function mapConceptDtoToDomain(dto: ConceptDto): SchemaConcept {
  return {
    name: dto.name ?? "",
    properties: dto.properties?.map(mapPropertyDtoToDomain) ?? [],
  };
}

export function mapConstraintDtoToDomain(dto: ConstraintDto): SchemaConstraint {
  return {
    rule: dto.rule ?? "",
  };
}

export function mapSchemaDtoToDomain(dto: SchemaDto): DataSchema {
  return {
    id: dto.id ?? "",
    name: dto.title ?? "",
    description: dto.description,
    concepts: dto.concepts?.map(mapConceptDtoToDomain) ?? [],
    constraints: dto.constraints?.map(mapConstraintDtoToDomain) ?? [],
  };
}

// Map domain back to DTO for create/update operations
export function mapDomainToSchemaDto(schema: Partial<DataSchema>): SchemaDto {
  return {
    id: schema.id,
    title: schema.name,
    description: schema.description,
    concepts: schema.concepts?.map((concept) => ({
      name: concept.name,
      properties: concept.properties?.map((prop) => ({
        name: prop.name,
        typeId: prop.typeId ?? prop.type?.id,
      })),
    })),
    constraints: schema.constraints?.map((constraint) => ({
      rule: constraint.rule,
    })),
  };
}

// =============================================================================
// Create/Update DTOs (for sending to API)
// =============================================================================

export interface CreateDataSchemaDto {
  id?: ID;
  name: string;
  description?: string;
  concepts: (Omit<SchemaConcept, "id" | "properties"> & {
    id?: ID;
    properties: Omit<SchemaProperty, "id">[];
  })[];
  constraints?: Omit<SchemaConstraint, "id">[];
}

// =============================================================================
// Output Ports
// =============================================================================

export interface SchemaOutputPort {
  presentSchemas(schemas: DataSchema[]): void;
  presentDataTypes(types: SchemaDataType[]): void;
  presentListSchemasError(error: unknown): void;
  presentListDataTypesError(error: unknown): void;

  presentAddSchemaSuccess(): void;
  presentAddSchemaError(error: unknown): void;

  presentSchemaDetails(schema: DataSchema): void;
  presentGetSchemaError(error: unknown): void;

  presentEditSchemaSuccess(): void;
  presentEditSchemaError(error: unknown): void;
}

export interface SetDatasetSchemaOutputPort {
  presentDataset(dataset: Dataset): void;
  presentLoadDatasetError(error: unknown): void;
  presentSchemas(schemas: DataSchema[]): void;
  presentLoadSchemasError(error: unknown): void;
  presentSetSchemaSuccess(): void;
  presentSetSchemaError(error: unknown): void;
}

import type { ID, ISODateString } from "../common.types";

export interface SchemaDataType{
  id: ID;
  name: string;
}

export interface SchemaProperty {
  name: string;
  type: SchemaDataType;
  description?: string;
  isMandatory: boolean;
  unit?: string;
}

export interface SchemaConcept {
  id: ID;
  name: string;
  description?: string;
  properties: SchemaProperty[];
}

export interface SchemaConstraint {
  id: ID;
  name: string;
  expression: string;
  description?: string;
}

export interface DataSchema {
  id: ID;
  name: string;
  version: string;
  description?: string;
  
  concepts: SchemaConcept[];
  constraints?: SchemaConstraint[];
  
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

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

export interface UpdateDataSchemaDto extends Partial<CreateDataSchemaDto> {
}


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
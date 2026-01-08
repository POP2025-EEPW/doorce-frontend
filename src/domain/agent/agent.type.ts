import type {ID} from "@/domain/common.types.ts";

export type AgentRole = "DataOwner" | "DataSupplier";


export interface Agent {
  id: ID;
  name: string;
  typeName: string;
  email: string;
  roles: AgentRole[];
}

export interface CreateAgentDto {
  name: string;
  typeName: string;
  email: string;
  roles: AgentRole[];
}

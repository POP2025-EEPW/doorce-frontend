export type AgentRole = "DataOwner" | "DataSupplier";

export interface Agent {
  id: string;
  name: string;
  roles: AgentRole[];
}

export interface CreateAgentDto {
  name: string;
  roles: AgentRole[];
}

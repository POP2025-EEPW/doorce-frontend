import { createApiClient } from "@/api/client";
import type {Agent, AgentRole, CreateAgentDto} from "./agent.type";

export default class AgentUseCase {

  constructor(private readonly client: ReturnType<typeof createApiClient>) {}

  async listAgents(): Promise<Agent[]> {
    const response = await this.client.GET("/api/agents");

    if (response.error) {
      throw new Error("error/get/agent/list");
    }

    if (!response.data) {
      throw new Error("error/get/agent/list");
    }

    const agents: Agent[] = [];
    for(const agent of response.data.content??[]){
      agents.push({
        id: agent.id??"",
        name: agent.name??"",
        typeName: agent.typeName??"",
        email: agent.email??"",
        roles: [
            ...(agent.dataOwner? ["DataOwner"] : []),
            ...(agent.dataSupplier? ["DataSupplier"] : []),
        ] as AgentRole[]
      });
    }

    return agents as unknown as Agent[];
  }

  async addAgent(input: CreateAgentDto): Promise<void> {
    const response = await this.client.POST("/api/agents", {
      body: {
        name: input.name,
        typeName: input.typeName,
        email: input.email,
        createAsDataOwner: input.roles.includes("DataOwner"),
        createAsDataSupplier: input.roles.includes("DataSupplier")
      },
    });

    if (response.error) {
      throw new Error("error/add/agent");
    }
  }
}

import { createApiClient } from "@/api/client";
import type { Agent, CreateAgentDto } from "./agent.type";
import mockAgents from "@/mocks/agents.json";

export default class AgentUseCase {
  private mockAgents: Agent[] = mockAgents as Agent[];

  constructor(private readonly client: ReturnType<typeof createApiClient>) {}

  async addAgent(input: CreateAgentDto): Promise<void> {
    // const response = await this.client.POST("/api/agents", {
    //   body: input,
    // });

    // if (response.error) {
    //   throw new Error("error/add/agent");
    // }

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        const newAgent: Agent = {
          id: `mock-${Date.now()}`,
          ...input,
        };

        this.mockAgents.push(newAgent);

        resolve();
      }, 500);
    });
  }
}

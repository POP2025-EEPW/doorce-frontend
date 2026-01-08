import type { Agent } from "@/domain/agent/agent.type";

export interface AddAgentNotification {
  type: "success" | "error";
  message: string;
}

export interface AgentViewState {
  isModalOpen: boolean;
  notification: AddAgentNotification | null;
  agents: Agent[];
}

type StateUpdater = (updater: (prev: AgentViewState) => AgentViewState) => void;

export default class AgentPresenter {
  constructor(private readonly updateState: StateUpdater) {}

  presentAddSuccess(): void {
    this.updateState((prev) => ({
      ...prev,
      isModalOpen: false,
      notification: {
        type: "success",
        message: "Agent added successfully.",
      },
    }));
  }

  presentAddError(): void {
    this.updateState((prev) => ({
      ...prev,
      notification: {
        type: "error",
        message: "Failed to add agent.",
      },
    }));
  }

  presentListError(): void {
    this.updateState((prev) => ({
      ...prev,
      notification: {
        type: "error",
        message: "Failed to list agents.",
      },
    }));
  }

  presentList(agentList: Agent[]): void {
    this.updateState((prev) => ({
      ...prev,
      agents: agentList
    }));
  }

  showAddAgentForm(): void {
    this.updateState((prev) => ({
      ...prev,
      isModalOpen: true,
      notification: null,
    }));
  }

  presentCloseModal(): void {
    this.updateState((prev) => ({
      ...prev,
      isModalOpen: false,
    }));
  }
}

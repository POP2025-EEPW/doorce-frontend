import type { CreateAgentDto } from "@/domain/agent/agent.type";
import AddAgentForm from "../components/AddAgentForm.view";
import { useAgentController } from "@/application/agent/agent.controller";
import { Button } from "@/ui/lib/components/ui/button";

export interface AgentPageProps {
  isModalOpen: boolean;
  notification: { type: "success" | "error"; message: string } | null;

  showAddAgentForm: () => void;
  onCloseModal: () => void;
  onSubmitAgent: (dto: CreateAgentDto) => void;
}

export default function AgentPage() {
  const {
    isModalOpen,
    notification,
    showAddAgentForm,
    onCloseModal,
    onSubmitAgent,
  } = useAgentController();

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Agents</h1>
        <Button onClick={showAddAgentForm}>Add Agent</Button>
      </div>

      {notification && (
        <div
          className={`p-3 mb-4 ${
            notification.type === "success" ? "bg-green-200" : "bg-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded shadow-md w-96">
            <AddAgentForm onSubmit={onSubmitAgent} onCancel={onCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}

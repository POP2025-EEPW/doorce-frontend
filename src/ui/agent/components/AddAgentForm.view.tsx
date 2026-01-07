import { useState } from "react";
import type { CreateAgentDto, AgentRole } from "@/domain/agent/agent.type";
import { Button } from "@/ui/lib/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/ui/lib/components/ui/dialog";
import { Input } from "@/ui/lib/components/ui/input";

interface Props {
  onSubmit: (dto: CreateAgentDto) => void;
  onCancel: () => void;
}

const availableRoles: AgentRole[] = ["DataOwner", "DataSupplier"];

export default function AddAgentForm({ onSubmit, onCancel }: Props) {
  const [name, setName] = useState("");
  const [roles, setRoles] = useState<AgentRole[]>([]);

  const toggleRole = (role: AgentRole) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      roles,
    });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>Add Agent</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="grid grid-cols-1 gap-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent's name..."
              className="w-full"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Roles</label>
            <div className="flex flex-col gap-2">
              {availableRoles.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={roles.includes(role)}
                    onChange={() => toggleRole(role)}
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={!name.trim()}>
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

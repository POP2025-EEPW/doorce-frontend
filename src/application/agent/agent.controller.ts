import { useRef, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import type { CreateAgentDto } from "@/domain/agent/agent.type";
import AgentPresenter from "./agent.presenter";
import type { AgentViewState } from "./agent.presenter";
import AgentUseCase from "@/domain/agent/agent.uc";

const initialState: AgentViewState = {
  isModalOpen: false,
  notification: null,
  agents: [],
};

export function useAgentController() {
  const [state, setState] = useState<AgentViewState>(initialState);

  const deps = useRef<{
    useCase: AgentUseCase;
    presenter: AgentPresenter;
  } | null>(null);

  deps.current ??= {
    useCase: new AgentUseCase(apiClient),
    presenter: new AgentPresenter(setState),
  };

  const { useCase, presenter } = deps.current;

  const addMutation = useMutation({
    mutationFn: (dto: CreateAgentDto) => useCase.addAgent(dto),
    onSuccess: () => {
      presenter.presentAddSuccess();
    },
    onError: () => {
      presenter.presentAddError();
    },
  });

  const openModal = useCallback(() => {
    presenter.showAddAgentForm();
  }, [presenter]);

  const closeModal = useCallback(() => {
    presenter.presentCloseModal();
  }, [presenter]);

  const submitAgent = useCallback(
    (dto: CreateAgentDto) => {
      addMutation.mutate(dto);
    },
    [addMutation],
  );

  return {
    isModalOpen: state.isModalOpen,
    notification: state.notification,
    agents: state.agents,

    showAddAgentForm: openModal,
    onCloseModal: closeModal,
    onSubmitAgent: submitAgent,
  };
}

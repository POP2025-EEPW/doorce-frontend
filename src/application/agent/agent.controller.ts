import {useRef, useState, useCallback, useEffect} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";

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

  const { data: agents = [], isLoading: isAgentsLoading, error: agentListError, refetch} = useQuery({
    queryKey: ["listAgents"],
    queryFn: () => useCase.listAgents()
  });

  useEffect(() => {
    if (agentListError) {
      presenter.presentListError();
    }
  }, [agentListError, presenter]);

  const addMutation = useMutation({
    mutationFn: (dto: CreateAgentDto) => useCase.addAgent(dto),
    onSuccess: async () => {
      presenter.presentAddSuccess();
      await refetch();
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
    agents: agents,
    isAgentsLoading,

    showAddAgentForm: openModal,
    onCloseModal: closeModal,
    onSubmitAgent: submitAgent,
  };
}

import { useRef, useState, useCallback, useEffect } from "react";
import { apiClient } from "@/api/client";
import type {
  CreateDataSchemaDto,
  DataSchema,
} from "@/domain/schema/schema.type";
import SchemaPresenter, { type SchemaViewState } from "./schema.presenter";
import SchemaUseCase from "@/domain/schema/schema.uc";

const initialState: SchemaViewState = {
  isModalOpen: false,
  notification: null,
  schemas: [],
  dataTypes: [],
  selectedSchema: null,
};

export function useSchemaController() {
  const [state, setState] = useState<SchemaViewState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const deps = useRef<{
    useCase: SchemaUseCase;
    presenter: SchemaPresenter;
  } | null>(null);

  if (!deps.current) {
    const presenter = new SchemaPresenter(setState);
    const useCase = new SchemaUseCase(apiClient, presenter);
    deps.current = { useCase, presenter };
  }

  const { useCase, presenter } = deps.current;

  const loadSchemas = useCallback(async () => {
    setIsLoading(true);
    try {
      await useCase.listSchemas();
    } finally {
      setIsLoading(false);
    }
  }, [useCase]);

  useEffect(() => {
    loadSchemas();
  }, [loadSchemas]);

  const loadDataTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      await useCase.listDataTypes();
    } finally {
      setIsLoading(false);
    }
  }, [useCase]);

  useEffect(() => {
    loadDataTypes();
  }, [loadDataTypes]);

  const openAddModal = useCallback(() => {
    presenter.showAddSchemaForm();
  }, [presenter]);

  const openEditModal = useCallback(
    (schema: DataSchema) => {
      presenter.showEditSchemaForm(schema);
    },
    [presenter],
  );

  const closeModal = useCallback(() => {
    presenter.presentCloseModal();
  }, [presenter]);

  const clearNotification = useCallback(() => {
    presenter.clearNotification();
  }, [presenter]);

  const submitSchema = useCallback(
    async (dto: CreateDataSchemaDto) => {
      setIsLoading(true);
      try {
        if (dto.id) {
          await useCase.editSchema(dto);
        } else {
          await useCase.addSchema(dto);
        }

        await loadSchemas();
      } finally {
        setIsLoading(false);
      }
    },
    [useCase, loadSchemas],
  );

  return {
    schemas: state.schemas,
    dataTypes: state.dataTypes,
    isModalOpen: state.isModalOpen,
    notification: state.notification,
    selectedSchema: state.selectedSchema,
    isLoading,

    showAddSchemaForm: openAddModal,
    showEditSchemaForm: openEditModal,
    onCloseModal: closeModal,
    onSubmitSchema: submitSchema,
    refreshSchemas: loadSchemas,
    clearNotification,
  };
}

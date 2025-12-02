// domain/dataset/editDataset.uc.ts
import { createApiClient } from "@/api/client";
import type {
  Dataset,
  UpdateDatasetDto,
  EditDatasetOutputPort,
} from "./dataset.types";

export default class EditDatasetUseCase {
  constructor(
    private readonly client: ReturnType<typeof createApiClient>,
    private readonly outputPort: EditDatasetOutputPort,
  ) {}

  async loadDataset(id: string): Promise<Dataset> {
    try {
      const response = await this.client.GET("/api/datasets/{id}", {
        params: { path: { id } },
      });

      if (response.error) {
        throw new Error("error/get/dataset");
      }

      if (!response.data) {
        throw new Error("no-data/get/dataset");
      }

      const dataset = response.data as unknown as Dataset;

      this.outputPort.presentDataset(dataset);

      return dataset;
    } catch (error) {
      this.outputPort.presentLoadDatasetError(error);
      throw error;
    }
  }

  async editDataset(id: string, dto: UpdateDatasetDto): Promise<void> {
    try {
      const response = await this.client.PUT("/api/datasets/{id}", {
        params: { path: { id } },
        body: dto,
      });

      if (response.error) {
        throw new Error("error/edit/dataset");
      }

      this.outputPort.presentEditDatasetSuccess();
    } catch (error) {
      this.outputPort.presentEditDatasetError(error);
      throw error;
    }
  }
}

import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatasetInfoView } from "./DatasetInfo.view";
import datasets from "@/mocks/mock_data/datasets.json";
import datasetDescriptions from "@/mocks/mock_data/dataset-descriptions.json";
import type { Dataset, DatasetDescription } from "@/domain/types/dataset";

const meta: Meta<typeof DatasetInfoView> = {
  title: "Views/Datasets/DatasetInfoView",
  component: DatasetInfoView,
};
export default meta;

type Story = StoryObj<typeof DatasetInfoView>;

const ds = datasets[0] as Dataset;
const dsDescription = datasetDescriptions[0] as DatasetDescription;

export const Default: Story = {
  args: {
    dataset: ds,
  },
};

export const WithDescription: Story = {
  args: {
    dataset: ds,
    description: dsDescription,
  },
};

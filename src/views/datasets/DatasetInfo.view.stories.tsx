import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatasetInfoView } from "./DatasetInfo.view";
import datasets from "@/mocks/mock_data/datasets.json";
import type { Dataset } from "@/domain/types/dataset";

const meta: Meta<typeof DatasetInfoView> = {
  title: "Views/Datasets/DatasetInfoView",
  component: DatasetInfoView,
};
export default meta;

type Story = StoryObj<typeof DatasetInfoView>;

const ds = datasets[0] as Dataset;

export const Default: Story = {
  args: {
    dataset: ds,
  },
};
